import { CreateMatchDto } from "../../dtos/match/create.dto";
import { MatchEntity } from "../../entities/match.entity";
import { ResponseEntity } from "../../entities/response.entity";
import { MatchRepository } from "../../repositories/match/match.repositiry";

export interface CreateMatchesUseCase {
    execute(dto: CreateMatchDto): Promise<ResponseEntity>
}

export class CreateMatches implements CreateMatchesUseCase {
    constructor(private readonly repository: MatchRepository) { }

    async execute(dto: CreateMatchDto): Promise<ResponseEntity> {
        return this.repository.create(dto)
    }

}