import { StandingDatasource } from "../../../domain/datasource/standings/standing.datasource";
import { GetStandingsDto } from "../../../domain/dtos/standings/get-standings.dto";
import { ResponseEntity } from "../../../domain/entities/response.entity";
import { StandingRepository } from "../../../domain/repositories/standings/standings.repository";

export class StandingRepositoryImpl implements StandingRepository {
    constructor(private readonly datasource: StandingDatasource) { }

    getStandings(dto: GetStandingsDto): Promise<ResponseEntity> {
        return this.datasource.getStandings(dto);
    }
}