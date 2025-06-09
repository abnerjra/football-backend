import { MatchDatasource } from "../../../domain/datasource/match/match.datasource";
import { CreateMatchDto } from "../../../domain/dtos/match/create.dto";
import { GetMatchesDto } from "../../../domain/dtos/match/get-matches.dto";
import { SimulateMatchDto } from "../../../domain/dtos/match/simulate.dto";
import { ResponseEntity } from "../../../domain/entities/response.entity";
import { MatchRepository } from "../../../domain/repositories/match/match.repositiry";

export class MatchRepositoryImpl implements MatchRepository {
    constructor(private readonly datasource: MatchDatasource) { }
    getAll(dto: GetMatchesDto): Promise<ResponseEntity> {
        return this.datasource.getAll(dto);
    }

    create(dto: CreateMatchDto): Promise<ResponseEntity> {
        return this.datasource.create(dto);
    }

    simulate(dto: SimulateMatchDto): Promise<ResponseEntity> {
        return this.datasource.simulate(dto)
    }
}