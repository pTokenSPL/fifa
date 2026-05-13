/** Parse an ISO kickoff string and return a Date. */
export function parseKickoff(kickoffUtc: string): Date {
  return new Date(kickoffUtc);
}

/** Return true if the current time is within the typical 2-hour match window. */
export function isMatchLive(kickoffUtc: string): boolean {
  const kickoff = new Date(kickoffUtc).getTime();
  const now = Date.now();
  return now >= kickoff && now <= kickoff + 2 * 60 * 60 * 1000;
}

/** Calculate the number of rest days between two ISO date strings. */
export function restDaysBetween(earlierUtc: string, laterUtc: string): number {
  const diff = new Date(laterUtc).getTime() - new Date(earlierUtc).getTime();
  return Math.floor(diff / 86400000);
}

/** Format a UTC ISO string to a human-readable local date. */
export function formatMatchDate(kickoffUtc: string, locale = 'en-US'): string {
  return new Date(kickoffUtc).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
