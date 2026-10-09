/**
 * Two clocks on one bench.
 *
 * The rail already carries Sydney's local time, and the reason it is worth a
 * clock is the same reason a second one is: a reader in another timezone wants
 * to know whether the person they are reading about is awake. The gap answers
 * that without anyone doing the arithmetic, and it is read out of the zone the
 * browser actually applies rather than a table of fixed offsets, so a zone that
 * has moved its clocks is still read correctly.
 *
 * Pure functions and `Intl` only — no DOM, so the arithmetic can be checked
 * without rendering anything.
 */

/** The wall-clock offset of a zone, in minutes east of UTC, at one instant. */
export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const at = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  // The instant the zone's wall clock is showing, read as though it were UTC.
  // `% 24` because some locales spell midnight as hour 24 with `hour12: false`.
  const wallClock = Date.UTC(
    at('year'),
    at('month') - 1,
    at('day'),
    at('hour') % 24,
    at('minute'),
    at('second'),
  );

  return Math.round((wallClock - date.getTime()) / 60_000);
}

/** A gap in hours and minutes as a person would say it: `9h`, `5h 30m`. */
export function formatGap(minutes: number): string {
  const total = Math.abs(minutes);
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export interface Clocks {
  /** The bench's own time, on a 24-hour clock, with its zone: `23:02 AEDT`. */
  here: string;
  /** The visitor's time. Null when they are already on the bench's clock. */
  yours: string | null;
  /** How the bench's clock sits against the visitor's: `9h ahead of you`. */
  gap: string | null;
}

export function readClocks(now: Date, benchZone: string, visitorZone: string): Clocks {
  const here = new Intl.DateTimeFormat('en-AU', {
    timeZone: benchZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  }).format(now);

  if (visitorZone === benchZone) return { here, yours: null, gap: null };

  const yours = new Intl.DateTimeFormat('en-AU', {
    timeZone: visitorZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  const delta = zoneOffsetMinutes(now, benchZone) - zoneOffsetMinutes(now, visitorZone);

  return {
    here,
    yours,
    gap:
      delta === 0
        ? 'same clock'
        : delta > 0
          ? `${formatGap(delta)} ahead of you`
          : `${formatGap(delta)} behind you`,
  };
}
