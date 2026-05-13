import { WorldCupSDKConfig } from './types.js';
import { ConfigError } from './errors.js';

export class SDKConfig {
  private config: Required<WorldCupSDKConfig>;

  constructor(input: WorldCupSDKConfig = {}) {
    this.config = this.applyDefaults(input);
    this.validate();
  }

  private applyDefaults(input: WorldCupSDKConfig): Required<WorldCupSDKConfig> {
    return {
      providers: {
        footballApi: {
          apiKey: process.env['FOOTBALL_API_KEY'] ?? '',
          baseUrl: 'https://v3.football.api-sports.io',
          ...input.providers?.footballApi,
        },
        news: {
          enabled: false,
          apiKey: '',
          ...input.providers?.news,
        },
      },
      cache: {
        ttlSeconds: Number(process.env['CACHE_TTL_SECONDS'] ?? 120),
        ...input.cache,
      },
    };
  }

  private validate(): void {
    const ttl = this.config.cache.ttlSeconds;
    if (typeof ttl !== 'number' || ttl < 1) {
      throw new ConfigError('cache.ttlSeconds must be a positive number');
    }
  }

  get<K extends keyof Required<WorldCupSDKConfig>>(key: K): Required<WorldCupSDKConfig>[K] {
    return this.config[key];
  }

  getAll(): Required<WorldCupSDKConfig> {
    return { ...this.config };
  }
}
