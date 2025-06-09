import { Request, Response } from "express";
import { GetTeams } from '../../domain/use-cases/team/get-teams.usecase';
import { GetTeamsDto } from "../../domain/dtos/team/get-teams.dto";
import { TeamRepository } from "../../domain/repositories/team/team.repository";
import { CreateTeamDto } from "../../domain/dtos/team/create.dto";
import { CreateTeam } from "../../domain/use-cases/team/create-team.usecase";
import { UpdateTeamDto } from "../../domain/dtos/team/update.dto";
import { UpdateTeam } from "../../domain/use-cases/team/update-team.usecase";

export class TeamController {
    constructor(private readonly repository: TeamRepository) { }

    getAll = (req: Request, res: Response) => {
        const [error, getTeamsDto] = GetTeamsDto.create(req.query)
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new GetTeams(this.repository).execute(getTeamsDto!)
            .then(response => {
                const { data, message, severity, statusCode, paginated } = response
                res.status(statusCode).json({ severity, message, data, paginated })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    create = (req: Request, res: Response) => {
        const [error, dto] = CreateTeamDto.create(req.body)
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: []
            });
            return;
        }

        new CreateTeam(this.repository).execute(dto!)
            .then(response => {
                const { data, message, severity, statusCode } = response
                res.status(statusCode).json({ severity, message, data })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    update = (req: Request, res: Response) => {
        const id = +req.params.id
        const [error, dto] = UpdateTeamDto.create({ ...req.body, id })
        if (error) {
            res.status(400).json({ severity: 'error', message: error, data: [] })
            return
        }

        new UpdateTeam(this.repository).execute(dto!)
            .then(response => {
                const { data, message, severity, statusCode } = response
                res.status(statusCode).json({ severity, message, data })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }
}