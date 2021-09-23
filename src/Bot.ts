import Discord from "discord.js";
import { Commands } from "./Commands";

export type BotOptions = {
  debug: boolean;
};

export class Bot {
  private readonly token: string;
  private client: Discord.Client;

  constructor(token: string, options?: BotOptions) {
    this.client = new Discord.Client({
      intents: 3136,
      http: { version: 9 },
    });
    this.token = token || "";
    if (options?.debug) {
      this.debug();
    }
  }

  public start(): void {
    console.log("*** Starting the bot...");
    this.client.login(this.token);
    this.waitForReady();
  }

  private debug(): void {
    this.client.on("debug", (msg) => {
      console.log("[DEBUG]: " + msg);
    });
  }

  private waitForReady(): void {
    this.client.on("ready", () => {
      console.log("*** Bot ready");
      this.listenCommands();
    });
  }

  private listenCommands(): void {
    this.client.on("interaction", (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }
      if (interaction.commandName === "zoom") {
        Commands.getZoomLinkByRealizationCode(interaction);
      }
    });
  }
}
