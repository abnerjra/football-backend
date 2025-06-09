import { Request, Response } from "express";
import { MatchRepository } from "../../domain/repositories/match/match.repositiry";
import { GetMatches } from "../../domain/use-cases/match/get-matchs.usecase";
import { CreateMatches } from "../../domain/use-cases/match/create-matchs.usecase";
import { CreateMatchDto } from "../../domain/dtos/match/create.dto";
import { GetMatchesDto } from "../../domain/dtos/match/get-matches.dto";
import { SimulateMatchDto } from "../../domain/dtos/match/simulate.dto";
import { SimulateMatch } from "../../domain/use-cases/match/simulate-match.usecase";

export class MatchController {
    // DI
    constructor(private readonly repository: MatchRepository) { }

    getAll = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, dto] = GetMatchesDto.create({ ...req.query, limit, page })
        if (error) {
            res.status(400).json({ severity: 'error', message: error })
            return;
        }

        new GetMatches(this.repository).execute(dto!)
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
        const [error, createMatchDto] = CreateMatchDto.create(req.body)
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new CreateMatches(this.repository).execute(createMatchDto!)
            .then(response => {
                const { data, message, severity, statusCode } = response
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
            })
    }

    simulate = (req: Request, res: Response) => {
        const [error, simulateDto] = SimulateMatchDto.create(req.body)
        if (error) {
            res.status(400).json({ severity: 'error', message: error })
            return
        }

        new SimulateMatch(this.repository).execute(simulateDto!)
            .then(response => {
                const { data, message, severity, statusCode } = response
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
            })
    }
} 