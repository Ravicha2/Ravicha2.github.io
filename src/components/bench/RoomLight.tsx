import type React from 'react';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../accessibility/useReducedMotion';

/**
 * The room light.
 *
 * A slow warm drift across the substrate, pulled toward the pointer — the lamp's
 * light on the wall, so the room answers when a visitor reaches into it. Same
 * gesture as the rail's lens, one layer down.
 *
 * Three things bound it, and none of them are taste:
 *
 *  1. It never goes brighter than `--lamplight`. That token is the last value
 *     that holds `--annotate` at 7:1, and the canvas is the lowest layer, so
 *     every glyph on the site sits on top of the light rather than beside it.
 *     The ceiling is enforced in `tokens.test.ts`, not by eye.
 *  2. Under `prefers-reduced-motion` it draws one frame and stops. No loop, no
 *     pointer listener: the room is simply lit as it was found.
 *  3. It is one draw call at a fraction of the device resolution onto a blurry
 *     noise field, so it is cheap enough to sit under a page obsessed with its
 *     own paint timings.
 */

const VERT = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform vec2 u_res;
uniform vec2 u_ptr;
uniform float u_t;
uniform vec3 u_bench;
uniform vec3 u_lamp;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 3; i++) { sum += amp * noise(p); p *= 2.03; amp *= 0.5; }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 q = uv * vec2(u_res.x / u_res.y, 1.0) * 1.7;

  // The drift is fbm warped by a second, slower fbm: it folds and re-folds
  // rather than sliding, so nothing reads as a texture scrolling past.
  vec2 warp = vec2(fbm(q + u_t * 0.026), fbm(q + 5.2 - u_t * 0.021));
  float field = fbm(q + 2.6 * warp);

  // The visitor's pull. Squared distance, so the light leans toward the pointer
  // and lets go quickly — a lamp tilting, not a spotlight following.
  vec2 d = (u_ptr / u_res - uv) * vec2(u_res.x / u_res.y, 1.0);
  field += 0.55 / (1.0 + 16.0 * dot(d, d));

  float light = smoothstep(0.42, 1.25, field);
  gl_FragColor = vec4(mix(u_bench, u_lamp, light), 1.0);
}`;

/** `#rrggbb` out of the stylesheet, so the palette keeps one home. */
function readToken(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

export const RoomLight: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Ask whether the environment has WebGL at all before asking the canvas for
    // a context. A test runner without it answers with a noisy "not implemented"
    // rather than a null, and the check costs nothing where WebGL does exist.
    if (typeof window.WebGLRenderingContext === 'undefined') return;

    // No WebGL: the substrate is already the body background, so the room is
    // simply unlit. Nothing depends on this.
    let gl: WebGLRenderingContext | null = null;
    try {
      // `alpha: true` on purpose. If this canvas ever fails to draw — no frame
      // yet, a lost context, a driver that gives up — it must fall back to the
      // substrate showing through, not to an opaque blank laid over the page.
      // The shader writes alpha 1, so a working canvas is still solid.
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: 'low-power',
      });
    } catch {
      gl = null;
    }
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!program || !vert || !frag) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    // One full-viewport triangle: no index buffer, no vertices to keep.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const slot = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(slot);
    gl.vertexAttribPointer(slot, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(gl.getUniformLocation(program, 'u_bench'), readToken('--bench', [0.11, 0.086, 0.075]));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_lamp'), readToken('--lamplight', [0.212, 0.18, 0.161]));
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uPtr = gl.getUniformLocation(program, 'u_ptr');
    const uT = gl.getUniformLocation(program, 'u_t');

    // Half resolution, and never more than 1.5 device pixels. The field is soft
    // noise, so the upscale costs nothing a reader can see and the fill rate
    // costs a quarter of what it would.
    let width = 0;
    let height = 0;
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      width = Math.max(1, Math.round(window.innerWidth * scale));
      height = Math.max(1, Math.round(window.innerHeight * scale));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = { x: 0.5, y: 0.5 };
    const pull = { x: 0.5, y: 0.5 };
    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / window.innerWidth;
      // gl_FragCoord counts up from the bottom; the pointer counts down.
      target.y = 1 - event.clientY / window.innerHeight;
    };

    const draw = (t: number) => {
      gl.uniform2f(uPtr, pull.x * width, pull.y * height);
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      draw(8);
      return () => window.removeEventListener('resize', resize);
    }

    window.addEventListener('pointermove', onPointer, { passive: true });

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      // Ease toward the pointer rather than tracking it: the light leans, it
      // does not snap. 0.05 per frame at 60fps settles in about a third of a
      // second, which is the same beat as the rail's lamp.
      pull.x += (target.x - pull.x) * 0.05;
      pull.y += (target.y - pull.y) * 0.05;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      // Deliberately no `loseContext()`. React 18 runs an effect twice on mount,
      // and a lost context is handed straight back by the next `getContext` on
      // the same canvas — the second mount would inherit a dead context and the
      // room would composite as a blank sheet over the page. Letting the context
      // be collected is both simpler and correct.
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className={`room-light ${className}`} />;
};

export default RoomLight;
