import { prisma } from "../../data/postgres"

export class TeamModel {
    static hasLeague = async (teamId: number) => {
        const league = await prisma.team.findFirst({
            where: { id: teamId },
            select: {
                league: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return league!.league;
    }
}