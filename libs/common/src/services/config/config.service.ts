import { BehaviorSubject, concatMap, map, switchMap, timer, EMPTY } from "rxjs";

import { ConfigApiServiceAbstraction } from "../../abstractions/config/config-api.service.abstraction";
import { ConfigServiceAbstraction } from "../../abstractions/config/config.service.abstraction";
import { ServerConfig } from "../../abstractions/config/server-config";
import { StateService } from "../../abstractions/state.service";
import { ServerConfigData } from "../../models/data/server-config.data";

export class ConfigService implements ConfigServiceAbstraction {
  protected _serverConfig = new BehaviorSubject<ServerConfig | null>(null);
  serverConfig$ = this._serverConfig.asObservable();

  constructor(
    private stateService: StateService,
    private configApiService: ConfigApiServiceAbstraction
  ) {
    // Re-fetch the server config every hour
    timer(0, 1000 * 3600)
      .pipe(
        map(async () => {
          return await this.buildServerConfig();
        })
      )
      .subscribe(async (serverConfig) => {
        this._serverConfig.next(await serverConfig);
      });

    this.stateService.activeAccountUnlocked$
      .pipe(
        switchMap((unlocked) => {
          if (!unlocked) {
            this._serverConfig.next(null);
            return EMPTY;
          }

          // Re-fetch the server config every hour
          return timer(0, 3600 * 1000).pipe(map(() => unlocked));
        }),
        concatMap(async (unlocked) => {
          return unlocked ? await this.buildServerConfig() : null;
        })
      )
      .subscribe((serverConfig) => {
        this._serverConfig.next(serverConfig);
      });
  }

  public async fetchServerConfig(): Promise<ServerConfig> {
    try {
      const response = await this.configApiService.get();

      if (response != null) {
        const data = new ServerConfigData(response);
        await this.stateService.setServerConfig(data);
        return new ServerConfig(data);
      }
    } catch {
      return null;
    }
  }

  public async getFeatureFlagBool(key: string, defaultValue: boolean): Promise<boolean> {
    return await this.getFeatureFlag(key, defaultValue);
  }
  public async getFeatureFlagString(key: string, defaultValue: string): Promise<string> {
    return await this.getFeatureFlag(key, defaultValue);
  }

  public async getFeatureFlagNumber(key: string, defaultValue: number): Promise<number> {
    return await this.getFeatureFlag(key, defaultValue);
  }

  private async getFeatureFlag<T>(key: string, defaultValue: T): Promise<T> {
    const serverConfig = await this.buildServerConfig();
    if (
      serverConfig == null ||
      serverConfig.featureStates == null ||
      serverConfig.featureStates[key] == null
    ) {
      return defaultValue;
    }

    return serverConfig.featureStates[key] as T;
  }

  private async buildServerConfig(): Promise<ServerConfig> {
    const data = await this.stateService.getServerConfig();
    const domain = data ? new ServerConfig(data) : null;

    if (domain == null || !domain.isValid() || domain.expiresSoon()) {
      const value = await this.fetchServerConfig();
      return value ?? domain;
    }

    return domain;
  }
}
