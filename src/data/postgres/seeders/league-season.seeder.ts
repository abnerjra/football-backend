import { prisma } from "..";

export class LeagueSeasonSeeder {
    private readonly className: string
    constructor() {
        this.className = this.constructor.name;
    }

    seed = async () => {
        let cont = 0;

        const leagues = await prisma.league.findMany();
        const seasons = await prisma.season.findMany();

        for (const league of leagues) {
            for (const season of seasons) {
                const exists = await prisma.leagueSeason.findFirst({ where: { leagueId: league.id, seasonId: season.id } })
                if (!exists) {
                    await prisma.leagueSeason.create({ data: { leagueId: league.id, seasonId: season.id } })
                    cont++;
                }
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${(leagues.length + seasons.length)}`);
    }
}