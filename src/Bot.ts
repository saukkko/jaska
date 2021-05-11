interface IBot {
  config: {
    apiKey: string;
    baseURL: string;
    appId: string;
    pubkey: string;
  };
}

export class Bot {
  config: IBot["config"];

  constructor(config: IBot["config"]) {
    this.config = config;
  }

  public getConfig(): void {
    console.log(this.config);
  }

  public setConfig(newConfig: IBot["config"]): void {
    this.config = newConfig;
  }
}
