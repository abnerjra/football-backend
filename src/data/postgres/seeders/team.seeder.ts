import { prisma } from "..";

export class TeamSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    private readonly teams = [
        { name: 'Arsenal', active: true, leagueId: 1 },
        { name: 'Aston Villa', active: true, leagueId: 1 },
        { name: 'Bournemouth', active: true, leagueId: 1 },
        { name: 'Brentford', active: true, leagueId: 1 },
        { name: 'Brighton', active: true, leagueId: 1 },
        { name: 'Chelsea', active: true, leagueId: 1 },
        { name: 'Crystal Palace', active: true, leagueId: 1 },
        { name: 'Everton', active: true, leagueId: 1 },
        { name: 'Fulham', active: true, leagueId: 1 },
        { name: 'Ipswich', active: true, leagueId: 1 },
        { name: 'Leicester City', active: true, leagueId: 1 },
        { name: 'Liverpool', active: true, leagueId: 1 },
        { name: 'Manchester City', active: true, leagueId: 1 },
        { name: 'Manchester United', active: true, leagueId: 1 },
        { name: 'Newcastle', active: true, leagueId: 1 },
        { name: 'Nottingham Forest', active: true, leagueId: 1 },
        { name: 'Southampton', active: true, leagueId: 1 },
        { name: 'Tottenham', active: true, leagueId: 1 },
        { name: 'West Ham', active: true, leagueId: 1 },
        { name: 'Wolves', active: true, leagueId: 1 }
    ]

    seed = async () => {
        let cont = 0;
        for (const team of this.teams) {
            const existsTeam = await prisma.team.findFirst({ where: { name: team.name, leagueId: team.leagueId } })
            if (!existsTeam) {
                await prisma.team.create({ data: team })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.teams.length}`);
    }
}