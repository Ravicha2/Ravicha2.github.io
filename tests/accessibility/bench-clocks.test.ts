import { describe, expect, it } from 'vitest';
import { formatGap, readClocks, zoneOffsetMinutes } from '../../src/utils/clocks';

// A fixed instant, so the arithmetic is tested rather than the clock: 2026-01-15
// 12:00 UTC. Sydney is on AEDT (UTC+11) then, London on GMT (UTC+0).
const NOW = new Date('2026-01-15T12:00:00Z');

describe('zoneOffsetMinutes', () => {
  it('reads a zone that is ahead of UTC as positive', () => {
    expect(zoneOffsetMinutes(NOW, 'Australia/Sydney')).toBe(11 * 60);
  });

  it('reads UTC itself as zero', () => {
    expect(zoneOffsetMinutes(NOW, 'UTC')).toBe(0);
  });

  it('reads a zone that is behind UTC as negative', () => {
    expect(zoneOffsetMinutes(NOW, 'America/New_York')).toBe(-5 * 60);
  });
});

describe('formatGap', () => {
  it('drops the minutes when the gap is whole hours', () => {
    expect(formatGap(120)).toBe('2h');
  });

  it('carries the minutes when there are any', () => {
    expect(formatGap(135)).toBe('2h 15m');
  });

  it('reads a half-hour zone without rounding it away', () => {
    expect(formatGap(330)).toBe('5h 30m');
  });
});

describe('readClocks', () => {
  it('states the gap from the visitor, not the absolute offset', () => {
    const clocks = readClocks(NOW, 'Australia/Sydney', 'Europe/London');
    expect(clocks.here).toBe('23:00 AEDT');
    expect(clocks.yours).toBe('12:00');
    expect(clocks.gap).toBe('11h ahead of you');
  });

  it('says behind when the visitor is east of the bench', () => {
    // Auckland is on NZDT (UTC+13), two hours the far side of Sydney's AEDT.
    expect(readClocks(NOW, 'Australia/Sydney', 'Pacific/Auckland').gap).toBe('2h behind you');
  });

  it('says ahead when the visitor is west of the bench', () => {
    // Tokyo is UTC+9, two hours short of Sydney.
    expect(readClocks(NOW, 'Australia/Sydney', 'Asia/Tokyo').gap).toBe('2h ahead of you');
  });

  it('drops the second line entirely when the visitor shares the bench clock', () => {
    expect(readClocks(NOW, 'Australia/Sydney', 'Australia/Sydney')).toEqual({
      here: '23:00 AEDT',
      yours: null,
      gap: null,
    });
  });
});
