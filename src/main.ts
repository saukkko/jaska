import { Bot } from "./Bot";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const file: string = fs.readFileSync("./config.json").toString();
const config = JSON.parse(file);

const bot = new Bot({ ...config, apiKey: process.env.KEY });

bot.getConfig();
