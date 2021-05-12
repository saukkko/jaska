import * as dotenv from "dotenv";
import { Bot, BotOptions } from "./Bot";
dotenv.config();

const opts: BotOptions = { debug: false };

if (process.argv[2] == "--debug") {
  opts.debug = true;
} else {
  opts.debug = false;
}

if (process.env.TOKEN) {
  const bot = new Bot(process.env.TOKEN, opts);
  bot.start();
} else {
  console.error(new Error("Token required but not found. Bot will not start"));
}
