import { Request, Response } from "express";
import { StandingRepository } from "../../domain/repositories/standings/standings.repository";
import { GetStandingsDto } from "../../domain/dtos/standings/get-standings.dto";
import { GetStandings } from "../../domain/use-cases/standings/get-standings.usecase";

export class StandingController {
    constructor(
        private readonly repository: StandingRepository
    ) { }

    getAll = (req: Request, res: Response) => {
        const [error, standingDto] = GetStandingsDto.create(req.query)
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new GetStandings(this.repository).execute(standingDto!)
            .then(response => {
                const { data, message, severity, statusCode, paginated } = response;
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
            })
    }
}