import { WorldCupSDKConfig } from './types.js';
import { SDKConfig } from './config.js';
import { Logger } from './logger.js';
import { MemoryCache } from './cache/memory-cache.js';

import { FixturesModule } from './fifa/fixtures.js';
import { TeamsModule } from './fifa/teams.js';
import { GroupsModule } from './fifa/groups.js';
import { StandingsModule } from './fifa/standings.js';
import { SquadsModule } from './fifa/squads.js';
import { PlayersModule } from './fifa/players.js';
import { VenuesModule } from './fifa/venues.js';
import { BracketModule } from './fifa/bracket.js';
import { MatchEventsModule } from './fifa/events.js';
import { HistoryModule } from './fifa/history.js';

import { FormEngine } from './intelligence/form-engine.js';
import { MatchupEngine } from './intelligence/matchup-engine.js';
import { InjuryImpact } from './intelligence/injury-impact.js';
import { SquadStrength } from './intelligence/squad-strength.js';
import { SchedulePressure } from './intelligence/schedule-pressure.js';
import { TiebreakSimulator } from './intelligence/tiebreak-simulator.js';
import { QualificationPath } from './intelligence/qualification-path.js';
import { UpsetDetector } from './intelligence/upset-detector.js';
import { NarrativeEngine } from './intelligence/narrative-engine.js';

export interface FifaNamespace {
  fixtures: FixturesModule;
  teams: TeamsModule;
  groups: GroupsModule;
  standings: StandingsModule;
  squads: SquadsModule;
  players: PlayersModule;
  venues: VenuesModule;
  bracket: BracketModule;
  events: MatchEventsModule;
  history: HistoryModule;
}

export interface IntelligenceNamespace {
  form: FormEngine;
  matchup: MatchupEngine;
  injuries: InjuryImpact;
  squadStrength: SquadStrength;
  schedulePressure: SchedulePressure;
  tiebreak: TiebreakSimulator;
  qualification: QualificationPath;
  upsets: UpsetDetector;
  narratives: NarrativeEngine;
}

export class WorldCupSDK {
  public readonly fifa: FifaNamespace;
  public readonly intelligence: IntelligenceNamespace;

  private readonly config: SDKConfig;
  private readonly logger: Logger;
  private readonly cache: MemoryCache;

  constructor(userConfig: WorldCupSDKConfig = {}) {
    this.config = new SDKConfig(userConfig);
    this.logger = Logger.getInstance();
    this.cache = new MemoryCache({ ttlSeconds: this.config.get('cache').ttlSeconds ?? 120 });

    this.logger.info('WorldCupSDK initializing', { version: '0.1.0' });

    this.fifa = {
      fixtures: new FixturesModule(this.cache),
      teams: new TeamsModule(this.cache),
      groups: new GroupsModule(this.cache),
      standings: new StandingsModule(this.cache),
      squads: new SquadsModule(this.cache),
      players: new PlayersModule(this.cache),
      venues: new VenuesModule(this.cache),
      bracket: new BracketModule(this.cache),
      events: new MatchEventsModule(this.cache),
      history: new HistoryModule(this.cache),
    };

    const partialIntelligence: Omit<IntelligenceNamespace, 'narratives'> = {
      form: new FormEngine(this.fifa),
      matchup: new MatchupEngine(this.fifa),
      injuries: new InjuryImpact(this.fifa),
      squadStrength: new SquadStrength(this.fifa),
      schedulePressure: new SchedulePressure(this.fifa),
      tiebreak: new TiebreakSimulator(this.fifa),
      qualification: new QualificationPath(this.fifa),
      upsets: new UpsetDetector(this.fifa),
    };

    this.intelligence = {
      ...partialIntelligence,
      narratives: new NarrativeEngine(this.fifa, partialIntelligence as IntelligenceNamespace),
    };

    this.logger.info('WorldCupSDK ready');
  }

  /** Clear all cached data and force fresh fetches on next calls. */
  clearCache(): void {
    this.cache.clear();
    this.logger.info('Cache cleared');
  }
}
