# wc2026-sdk

> Free, open-source TypeScript SDK for real-time FIFA World Cup 2026 data.

Get live fixtures, group standings, squads, bracket state, match events, and derived intelligence signals — all normalized, cached, and ready to drop into any TypeScript or JavaScript project.

---

## Token & Contract Address

**A token is coming.**

CA: `ErwW6AnSnAPA54JDWxuWsNFfNeWmNNJ47ptyoRzRpump`

Fees generated through the platform will be accumulated during the lead-up period while we finalize the launch of the betting website. Once the site opens with the official CA token, accumulated fees will be distributed to holders. Stay tuned for the official announcement.

---

## What this SDK provides

- **Real-time fixtures** — live scores, scheduled matches, results, filtered by stage, group, team, or status
- **Group standings** — live tables, sorted by FIFA tiebreak rules (points → goal difference → goals scored → H2H)
- **Squads & players** — full rosters, availability status, top scorers
- **Knockout bracket** — current bracket state, round-by-round nodes, elimination checks
- **Match events** — goals, cards, substitutions, penalties with minute timestamps
- **Historical data** — past World Cups, head-to-head records, title counts
- **Intelligence signals** — derived form ratings, matchup context, injury impact, squad strength, upset risk, qualification paths, narrative tags

Everything is free. No paid tier, no rate-limit wall for the data layer.

---

## Quick Start

```ts
import { WorldCupSDK } from "wc2026-sdk";

const sdk = new WorldCupSDK({
  providers: {
    footballApi: { apiKey: process.env.FOOTBALL_API_KEY },
  },
  cache: { ttlSeconds: 60 },
});

// Live fixtures right now
const live = await sdk.fifa.fixtures.live();

// Group A standings
const standings = await sdk.fifa.standings.group("A");

// Team form over last 5 matches
const form = await sdk.intelligence.form.team("team-argentina");

console.log(form.results);    // ["W", "W", "D", "W", "L"]
console.log(form.formRating); // 0.73
```

---

## Installation

```bash
npm install wc2026-sdk
# or
pnpm add wc2026-sdk
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|---|---|---|
| `FOOTBALL_API_KEY` | Recommended | Live fixtures, standings, and squad data from [api-football.com](https://api-football.com) (free tier available) |
| `CACHE_TTL_SECONDS` | Optional | Override default cache TTL in seconds (default: `120`) |

---

## Architecture

The SDK exposes two top-level namespaces on the `WorldCupSDK` class:

```
WorldCupSDK
├── sdk.fifa          Raw World Cup data
│   ├── fixtures      Schedules, results, live scores
│   ├── teams         Team profiles and lookup
│   ├── groups        Group structure and membership
│   ├── standings     Live group standings
│   ├── squads        Team rosters and availability
│   ├── players       Player profiles and top scorers
│   ├── venues        Stadium data
│   ├── bracket       Knockout bracket state
│   ├── events        Match events (goals, cards, subs)
│   └── history       Historical World Cups and H2H records
│
└── sdk.intelligence  Derived signals built on top of sdk.fifa
    ├── form          Recent W/D/L form rating (0–1)
    ├── matchup       Head-to-head matchup context
    ├── injuries      Unavailability impact scoring
    ├── squadStrength Availability + FIFA ranking composite
    ├── schedulePressure Rest days and turnaround flags
    ├── tiebreak      FIFA group tiebreak rules engine
    ├── qualification Stage advancement probability
    ├── upsets        Upset risk from ranking gap + form
    └── narratives    Match story tags and key storylines
```

All data flows through an in-memory TTL cache by default. Every module accepts the cache instance in its constructor, so fresh data is fetched automatically when entries expire.

---

## Full API Reference

### `sdk.fifa` — World Cup Data

| Method | Returns | Description |
|---|---|---|
| `fixtures.list(filters?)` | `Fixture[]` | List fixtures — filter by `stage`, `groupCode`, `team`, `status` |
| `fixtures.byId(id)` | `Fixture` | Single fixture by normalized ID (e.g. `wc26-match-048`) |
| `fixtures.recentResults(teamId, limit?)` | `Fixture[]` | Finished matches for a team, newest first |
| `fixtures.upcoming(teamId)` | `Fixture[]` | Scheduled fixtures for a team |
| `fixtures.live()` | `Fixture[]` | All fixtures currently in progress |
| `teams.list()` | `Team[]` | All teams in the tournament |
| `teams.byId(id)` | `Team` | Team by normalized ID (e.g. `team-france`) |
| `teams.byName(name)` | `Team \| undefined` | Fuzzy-match a team by common name |
| `groups.list()` | `Group[]` | All groups with member teams |
| `groups.byCode(code)` | `Group \| undefined` | Single group (e.g. `'B'`) |
| `standings.group(code)` | `GroupStanding[]` | Sorted standings for a group |
| `standings.all()` | `Record<GroupCode, GroupStanding[]>` | All group standings |
| `standings.forTeam(id)` | `GroupStanding \| undefined` | A team's current standing |
| `squads.byTeam(id)` | `Player[]` | Full squad roster |
| `squads.available(id)` | `Player[]` | Non-injured, non-suspended players |
| `squads.unavailable(id)` | `Player[]` | Players who cannot play |
| `players.byId(id)` | `Player` | Player profile |
| `players.byName(name, teamId?)` | `Player \| undefined` | Fuzzy player lookup |
| `players.topScorers(limit?)` | `Player[]` | Tournament top scorers |
| `venues.list()` | `Venue[]` | All tournament venues |
| `venues.byId(id)` | `Venue` | Venue by ID |
| `bracket.current()` | `BracketNode[]` | Full knockout bracket state |
| `bracket.byRound(round)` | `BracketNode[]` | Nodes for a specific round |
| `bracket.isEliminated(teamId)` | `boolean` | Whether a team is knocked out |
| `events.byMatch(id)` | `MatchEvent[]` | All events in a match |
| `events.goals(matchId)` | `MatchEvent[]` | Goals and own goals |
| `events.redCards(matchId)` | `MatchEvent[]` | Red cards only |
| `events.substitutions(matchId)` | `MatchEvent[]` | Substitutions only |
| `history.worldCup(year)` | `HistoricalWorldCup \| undefined` | Historical World Cup summary |
| `history.headToHead(teamA, teamB)` | `HeadToHead` | H2H record in World Cup matches |
| `history.titleCounts()` | `Record<string, number>` | Wins per nation across all World Cups |

### `sdk.intelligence` — Derived Signals

| Method | Returns | Description |
|---|---|---|
| `form.team(teamId, window?)` | `FormRecord` | W/D/L results, goals, 0–1 form rating |
| `matchup.compare({ homeTeam, awayTeam })` | `MatchupContext` | Form, H2H, favored team, narrative tags |
| `injuries.summary(teamId)` | `InjurySummary` | Unavailable players, impact score, risk flags |
| `squadStrength.evaluate(teamId)` | `SquadStrengthReport` | Rating, availability ratio, strength tier |
| `schedulePressure.evaluate(teamId)` | `SchedulePressureReport` | Rest days, short-turnaround flags |
| `tiebreak.simulate(groupCode, assumptions?)` | `TiebreakResult` | Final standings using FIFA tiebreak rules |
| `qualification.path(teamId)` | `QualificationPathReport` | Points needed, probability, elimination risk |
| `upsets.evaluate(fixtureId)` | `UpsetRisk \| undefined` | Upset probability and risk level |
| `narratives.forMatch(fixtureId)` | `MatchNarrative` | Tags: must-win, form-contrast, elimination-pressure |

---

## Directory Structure

```
wc2026-sdk/
├── package.json
├── tsconfig.json
├── .env.example
├── LICENSE
├── README.md
│
├── src/
│   ├── index.ts                     Public entry point
│   ├── sdk.ts                       WorldCupSDK class — wires all namespaces
│   ├── types.ts                     All shared TypeScript types
│   ├── errors.ts                    Error hierarchy
│   ├── logger.ts                    Structured logger with log levels
│   ├── config.ts                    SDKConfig — defaults and validation
│   │
│   ├── cache/
│   │   └── memory-cache.ts          In-memory TTL cache (default)
│   │
│   ├── fifa/                        Raw data layer
│   │   ├── fixtures.ts
│   │   ├── teams.ts
│   │   ├── groups.ts
│   │   ├── standings.ts
│   │   ├── squads.ts
│   │   ├── players.ts
│   │   ├── venues.ts
│   │   ├── bracket.ts
│   │   ├── events.ts
│   │   └── history.ts
│   │
│   ├── intelligence/                Derived signal layer
│   │   ├── form-engine.ts
│   │   ├── matchup-engine.ts
│   │   ├── injury-impact.ts
│   │   ├── squad-strength.ts
│   │   ├── schedule-pressure.ts
│   │   ├── tiebreak-simulator.ts
│   │   ├── qualification-path.ts
│   │   ├── upset-detector.ts
│   │   └── narrative-engine.ts
│   │
│   └── utils/
│       ├── dates.ts                 Kickoff parsing, isMatchLive(), rest days
│       ├── strings.ts               slugify, buildTeamId, normalizeTeamName
│       └── math.ts                  clamp, average, roundTo, normalizeToOne
│
└── examples/
    ├── basic-fixtures/              List fixtures and Group A standings
    ├── live-scores/                 Poll live scores every 30 seconds
    ├── group-standings/             All standings with projected qualifiers
    └── match-events/                Event timeline for a fixture
```

---

## Examples

### List live matches

```ts
const live = await sdk.fifa.fixtures.live();
live.forEach(f => {
  console.log(`${f.homeTeamId} ${f.homeScore}-${f.awayScore} ${f.awayTeamId}`);
});
```

### Get full group standings

```ts
const standings = await sdk.fifa.standings.all();
for (const [group, table] of Object.entries(standings)) {
  console.log(`Group ${group}`);
  table.forEach(row => console.log(`  ${row.position}. ${row.teamId} — ${row.points} pts`));
}
```

### Check injury impact before a match

```ts
const injuries = await sdk.intelligence.injuries.summary("team-brazil");
console.log(`Impact score: ${injuries.impactScore}`); // 0 = fine, 1 = severe
console.log(`Key absences: ${injuries.keyAbsences.join(", ")}`);
```

### Simulate group tiebreak

```ts
const result = await sdk.intelligence.tiebreak.simulate("B");
console.log(`Group B qualifiers: ${result.qualifiers.join(", ")}`);
```

### Match narrative tags

```ts
const narrative = await sdk.intelligence.narratives.forMatch("wc26-match-048");
console.log(narrative.tags);         // ["must-win", "elimination-pressure"]
console.log(narrative.keyStorylines); // ["Argentina must win to stay in contention"]
```

---

## Caching

The SDK uses an in-memory TTL cache by default. Every module reads from cache before making a network call. Set `ttlSeconds` to control how fresh the data is:

```ts
const sdk = new WorldCupSDK({
  cache: { ttlSeconds: 30 }, // 30-second TTL for near-real-time use
});

// Force a full refresh manually
sdk.clearCache();
```

For live match polling, set a low TTL (30–60 seconds) and call `sdk.clearCache()` between polls to bypass stale entries.

---

## Data Sources

The SDK is built to work with [api-football.com](https://api-football.com) (free tier, no credit card required for development). The provider layer is designed so additional sources can be wired in by implementing the module interfaces in `src/fifa/`.

---

## TypeScript

The SDK is written in strict TypeScript. All types are exported from `src/types.ts` and re-exported from the package root:

```ts
import type { Fixture, Team, GroupStanding, MatchEvent, FormRecord } from "wc2026-sdk";
```

---

## License

MIT — free to use, modify, and distribute.
