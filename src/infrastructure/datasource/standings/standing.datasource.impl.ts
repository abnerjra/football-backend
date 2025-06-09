import messages from "../../../config/handlers/messages/messages";
import { prisma } from "../../../data/postgres";
import { StandingDatasource } from "../../../domain/datasource/standings/standing.datasource";
import { GetStandingsDto } from "../../../domain/dtos/standings/get-standings.dto";
import { ResponseEntity } from "../../../domain/entities/response.entity";
import { StandingEntity } from "../../../domain/entities/standing.entity";

export class StandingDatasourceImpl implements StandingDatasource {
    async getStandings(dto: GetStandingsDto): Promise<ResponseEntity> {
        const { league, season } = dto;

        const filters = { leagueId: league, seasonId: season }
        const existsStandingsSeason = await prisma.standings.count({ where: filters })
        const getLeague = await prisma.league.findFirst({ where: { id: league } })
        const getseason = await prisma.season.findFirst({ where: { id: season } })
        if (!getLeague) return ResponseEntity.fromJson(messages.standing.notFound({ content: 'liga' }))
        if (!getseason) return ResponseEntity.fromJson(messages.standing.notFound({ content: 'temporada' }))
        const leagueName = getLeague!.name;
        const seasonName = getseason!.name;
        if (!existsStandingsSeason) return ResponseEntity.fromJson(messages.standing.empty({ leagueName, seasonName }))

        const getStandings = await prisma.standings.findMany({
            select: {
                team: {
                    select: { name: true }
                },
                played: true,
                champion: true,
                won: true,
                draw: true,
                lost: true,
                goalsScored: true,
                goalsAgainst: true,
                id: true,
                points: true
            },
            where: filters,
            orderBy: [{ points: "desc" }, { goalsScored: "desc" }],
        });

        let position = 0;
        const standings = getStandings.map(st => {
            position++;
            const team = st.team.name;
            return StandingEntity.fromJson({ ...st, team, position })
        })

        return ResponseEntity.fromJson({ ...messages.response.reads, data: standings })
    }
}