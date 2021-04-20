import { open } from "sqlite";
import sqlite3 from "sqlite3";
import disc from "./src/discordBot";

open({
  driver: sqlite3.Database,
  filename: "./database.db"

}).then(async (db) => {
  disc(db);
});