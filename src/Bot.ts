import Discord from "discord.js";
import { Commands } from "./Commands";

export type BotOptions = {
  debug: boolean;
};

export class Bot {
  private readonly token: string;
  private client: Discord.Client;

  constructor(token: string, options?: BotOptions) {
    this.client = new Discord.Client();
    this.token = token || "";
    if (options) {
      // parse options
      if (options.debug) {
        this.debug();
      }
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
      // this.fetchRealization();
      this.initCommands();
    });
  }

  private initCommands(): void {
    this.client.on("message", (msg) => {
      const cmd = new Commands();
      cmd.init(msg);
    });
  }

  /*
  private fetchRealization(): void {
    const url = "https://lukkarit.laurea.fi/rest/realization/";
    this.client.on("message", (msg) => {
      if (msg.content.startsWith("?toteutus")) {
        let code = "";
        code = msg.content.split(" ")[1].toUpperCase();
        if (code) {
          fetch(url + code)
            .then((res) => res.json())
            .then((data: Realization) => {
              console.log(data);

              msg.reply(this.trimRealization(data));
            });
        }
      }
    });
  }

  private trimRealization(obj: Realization): string {
    const trimmed = `\nKoodi: ${obj.code}\nNimi: ${obj.name}\nOpettaja: ${obj.teacher}\nKurssi alkaa: ${obj.start_date}\nKurssi päättyy: ${obj.end_date}\nIlmoittautumisaika: ${obj.enrollment_start_date} - ${obj.enrollment_end_date}\n\nLinkki toteutukseen: ${obj.realization_link}`;
    return trimmed;
  }
  */
}
