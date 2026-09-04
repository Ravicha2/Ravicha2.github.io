import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, ShieldAlert, Cpu, Database, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../accessibility/useReducedMotion';

type TraceStep = 'problem' | 'planner' | 'tools' | 'memory' | 'verifier' | 'result';

interface NodeState {
  id: TraceStep;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'active' | 'complete' | 'recovered';
}

export const ExecutionTrace: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(4); // Default to verified state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRecovered, setHasRecovered] = useState<boolean>(true);

  const steps: NodeState[] = [
    {
      id: 'problem',
      label: 'Input Spec',
      sublabel: 'Natural intent & constraints',
      icon: Cpu,
      status: activeStepIndex >= 0 ? 'complete' : 'pending',
    },
    {
      id: 'planner',
      label: 'Planner',
      sublabel: 'Decomposition & DAG',
      icon: Sparkles,
      status: activeStepIndex === 1 ? 'active' : activeStepIndex > 1 ? 'complete' : 'pending',
    },
    {
      id: 'tools',
      label: 'Tools & Memory',
      sublabel: hasRecovered ? 'Transient fault recovered' : 'Parallel Cypher / Vector',
      icon: Database,
      status: activeStepIndex === 2 ? 'active' : activeStepIndex > 2 ? (hasRecovered ? 'recovered' : 'complete') : 'pending',
    },
    {
      id: 'verifier',
      label: 'AST Verifier',
      sublabel: 'Deterministic rule gate',
      icon: ShieldAlert,
      status: activeStepIndex === 3 ? 'active' : activeStepIndex > 3 ? 'complete' : 'pending',
    },
    {
      id: 'result',
      label: 'Verified Result',
      sublabel: 'Zero drift execution',
      icon: CheckCircle2,
      status: activeStepIndex >= 4 ? 'complete' : 'pending',
    },
  ];

  useEffect(() => {
    if (!isRunning || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= 4) {
          setIsRunning(false);
          return 4;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isRunning, prefersReducedMotion]);

  const handleTriggerTrace = () => {
    setHasRecovered(true);
    setActiveStepIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStepIndex(4);
    setHasRecovered(true);
  };

  return (
    <div
      data-testid="execution-trace"
      role="region"
      aria-label="System execution trace simulation"
      className="bg-surface border border-border-subtle rounded-lg p-5 sm:p-6 space-y-4 font-mono text-xs select-none"
    >
      {/* Trace Terminal Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-solid animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-text-primary tracking-wide">EXECUTION TRACE</span>
          <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-canvas border border-border-subtle">
            DAG v2.4
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTriggerTrace}
            disabled={isRunning}
            aria-label="Run execution trace simulation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-solid disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <Play className="w-3 h-3 text-accent-solid" aria-hidden="true" />
            <span>Trace</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset trace"
            className="p-1 rounded bg-canvas border border-border-subtle text-text-muted hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Node Sequence Diagram */}
      <div className="space-y-2.5 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrentActive = activeStepIndex === idx && isRunning;
          const isComplete = step.status === 'complete';
          const isRecovered = step.status === 'recovered';

          return (
            <div key={step.id} className="relative">
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-3.5 top-7 w-[1px] h-3.5 transition-colors duration-300 ${
                    activeStepIndex > idx ? 'bg-accent-solid' : 'bg-border-subtle'
                  }`}
                  aria-hidden="true"
                />
              )}

              <div
                className={`flex items-start gap-3 p-2.5 rounded-md border transition-all duration-200 ${
                  isCurrentActive
                    ? 'bg-accent-badge-bg border-accent-solid text-accent-badge-text ring-1 ring-accent-solid'
                    : isComplete
                    ? 'bg-canvas border-border-subtle text-text-primary'
                    : isRecovered
                    ? 'bg-canvas border-border-subtle text-text-primary'
                    : 'bg-canvas/50 border-border-subtle/50 text-text-muted'
                }`}
              >
                {/* Step indicator bullet / icon */}
                <div
                  className={`p-1 rounded border flex-shrink-0 mt-0.5 ${
                    isCurrentActive
                      ? 'bg-accent-solid text-white dark:text-zinc-950 border-accent-solid'
                      : isComplete
                      ? 'bg-surface text-accent-solid border-border-subtle'
                      : isRecovered
                      ? 'bg-surface text-accent-solid border-border-subtle'
                      : 'bg-canvas text-text-muted border-border-subtle'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Step metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold tracking-tight text-xs text-text-primary">
                      {step.label}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border ${
                        isCurrentActive
                          ? 'bg-accent-solid text-white dark:text-zinc-950 border-accent-solid font-bold'
                          : isComplete
                          ? 'bg-surface text-accent-solid border-border-subtle'
                          : isRecovered
                          ? 'bg-surface text-accent-solid border-border-subtle'
                          : 'bg-surface text-text-muted border-border-subtle'
                      }`}
                    >
                      {isCurrentActive ? 'executing' : step.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5 truncate">
                    {step.sublabel}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Footer */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="text-accent-solid font-bold">›</span>
          <span>Recovery: Inngest durable checkpoint</span>
        </span>
        <span className="font-semibold text-text-primary">
          {isRunning ? 'STEP ' + (activeStepIndex + 1) + '/5' : 'VERIFIED 100%'}
        </span>
      </div>
    </div>
  );
};

export default ExecutionTrace;
