import disc from "./src/discordBot";
import { PrismaClient } from "@prisma/client";


const db = new PrismaClient();

async function main() {
    disc(db);
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await db.$disconnect();
    });