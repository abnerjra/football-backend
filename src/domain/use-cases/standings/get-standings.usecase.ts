import { GetStandingsDto } from "../../dtos/standings/get-standings.dto";
import { ResponseEntity } from '../../entities/response.entity';
import { StandingRepository } from "../../repositories/standings/standings.repository";

export interface GetStandingsUseCase {
    execute(dto: GetStandingsDto): Promise<ResponseEntity>
}

export class GetStandings implements GetStandingsUseCase {
    constructor(private readonly repository: StandingRepository) { }

    async execute(dto: GetStandingsDto): Promise<ResponseEntity> {
        return this.repository.getStandings(dto)
    }
}