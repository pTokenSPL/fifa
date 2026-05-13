export class WorldCupSDKError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'WorldCupSDKError';
  }
}

export class NotFoundError extends WorldCupSDKError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConfigError extends WorldCupSDKError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

export class ProviderError extends WorldCupSDKError {
  constructor(provider: string, message: string) {
    super(`[${provider}] ${message}`, 'PROVIDER_ERROR');
    this.name = 'ProviderError';
  }
}
