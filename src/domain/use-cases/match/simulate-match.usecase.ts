import { SimulateMatchDto } from "../../dtos/match/simulate.dto";
import { ResponseEntity } from "../../entities/response.entity";
import { MatchRepository } from "../../repositories/match/match.repositiry";

export interface SimulateUseCase {
    execute(dto: SimulateMatchDto): Promise<ResponseEntity>
}

export class SimulateMatch implements SimulateUseCase {
    constructor(private readonly repository: MatchRepository) { }

    async execute(dto: SimulateMatchDto): Promise<ResponseEntity> {
        return this.repository.simulate(dto)
    }

}