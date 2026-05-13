/** Convert a string to a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a deterministic team ID from a team name. */
export function buildTeamId(name: string): string {
  return `team-${slugify(name)}`;
}

/** Build a deterministic player ID from a player name and team ID. */
export function buildPlayerId(playerName: string, teamId: string): string {
  return `player-${slugify(playerName)}-${teamId.replace('team-', '')}`;
}

/** Build a deterministic fixture ID for WC 2026. */
export function buildFixtureId(matchNumber: number): string {
  return `wc26-match-${String(matchNumber).padStart(3, '0')}`;
}

/** Normalize team name for fuzzy matching (remove accents, lowercase). */
export function normalizeTeamName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
