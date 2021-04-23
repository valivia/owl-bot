import disc from "./src/discordBot";
import db from "mariadb";
import settings from "./settings.json"

db.createConnection(settings.db).then(conn => {
    disc(conn);
})