import messages from "../../../config/handlers/messages/messages";
import { prisma } from "../../../data/postgres";
import { TeamDatasource } from "../../../domain/datasource/team/team.datasource";
import { CreateTeamDto } from "../../../domain/dtos/team/create.dto";
import { GetTeamsDto } from "../../../domain/dtos/team/get-teams.dto";
import { UpdateTeamDto } from "../../../domain/dtos/team/update.dto";
import { ResponseEntity } from "../../../domain/entities/response.entity";
import { TeamEntity } from "../../../domain/entities/team.entity";
import { TeamModel } from "../../models/team.model";

export class TeamDatasourceImpl implements TeamDatasource {
    async getAll(dto: GetTeamsDto): Promise<ResponseEntity> {
        const { league, name, active } = dto;
        const page = Number(dto.page)
        const limit = Number(dto.limit)
        const skip = (page - 1) * limit;

        const filters: { [key: string]: any } = {};
        filters.active = active
        filters.leagueId = league
        if (name) filters.name = { contains: name, mode: 'insensitive' }

        const [total, teams] = await Promise.all([
            await prisma.team.count({ where: filters }),
            await prisma.team.findMany({
                select: { id: true, name: true, active: true },
                where: filters,
                orderBy: { name: "asc" },
                skip,
                take: limit
            })
        ])

        const data = await Promise.all(
            teams.map(async (team) => {
                const associatedLeague = await TeamModel.hasLeague(team.id);
                return TeamEntity.fromJson({ ...team, league: associatedLeague })
            })
        );

        const paginated = {
            totalRecords: total,
            totalPerPage: data.length,
            totalPages: Math.ceil(total / limit),
            page,
            limit
        }

        return ResponseEntity.fromJson({ ...messages.response.reads, data, paginated })
    }

    async create(dto: CreateTeamDto): Promise<ResponseEntity> {
        const { name, active, league } = dto;
        const activeLeague = await prisma.league.count({ where: { id: league, active: true } })
        if (!activeLeague) return ResponseEntity.fromJson({ ...messages.validate.field({ message: `La liga ingresada no existe`, level: 1 }) })
        const existsName = await prisma.team.count({ where: { name: { contains: name, mode: 'insensitive' }, leagueId: league } })
        if (existsName) return ResponseEntity.fromJson({ ...messages.validate.field({ message: `Ya existe un equipo registrado con el nombre ${name} en esta liga`, level: 2 }) })

        const team = await prisma.team.create({ data: { name, active, leagueId: league } })
        const teamLeague = await TeamModel.hasLeague(team.id)
        const data = TeamEntity.fromJson({ ...team, league: teamLeague })
        return ResponseEntity.fromJson({ ...messages.response.create, data })
    }

    async update(dto: UpdateTeamDto): Promise<ResponseEntity> {
        const { id, name, active, league } = dto;
        const activeLeague = await prisma.league.count({ where: { id: league, active: true } })
        if (!activeLeague) return ResponseEntity.fromJson({ ...messages.validate.field({ message: `La liga ingresada no existe`, level: 1 }) })
        const existsName = await prisma.team.count({
            where: {
                name: { contains: name, mode: 'insensitive' },
                leagueId: league,
                NOT: { id: id }
            }
        })
        if (existsName) return ResponseEntity.fromJson({ ...messages.validate.field({ message: `Ya existe un equipo registrado con el nombre ${name} en esta liga`, level: 2 }) })

        const team = await prisma.team.update({
            where: { id: id },
            data: { name: name, active: active, leagueId: league }
        })
        const teamLeague = await TeamModel.hasLeague(team.id)
        const data = TeamEntity.fromJson({ ...team, league: teamLeague })
        return ResponseEntity.fromJson({ ...messages.response.update, data })
    }
}