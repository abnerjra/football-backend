import { prisma } from "..";

export class LeagueSeeder {

    private className
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        let cont = 0;
        const countryENG = await prisma.country.findFirst({ where: { key: 'ENG' } })
        const countryITA = await prisma.country.findFirst({ where: { key: 'ITA' } })

        const leagues = [
            {
                name: 'Premier League',
                countryId: countryENG!.id,
                active: true
            },
            {
                name: 'Serie A',
                countryId: countryITA!.id,
                active: true
            }
        ]

        for (const league of leagues) {
            const exists = await prisma.league.findFirst({ where: { name: league.name, countryId: league.countryId } })
            if (!exists) {
                await prisma.league.create({ data: league })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${leagues.length}`);
    }
}