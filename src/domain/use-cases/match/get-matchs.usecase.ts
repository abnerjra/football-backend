import { GetMatchesDto } from "../../dtos/match/get-matches.dto";
import { ResponseEntity } from "../../entities/response.entity";
import { MatchRepository } from "../../repositories/match/match.repositiry";

export interface GetMatchesUseCase {
    execute(dto: GetMatchesDto): Promise<ResponseEntity>
}

export class GetMatches implements GetMatchesUseCase {
    constructor(private readonly repository: MatchRepository) { }

    async execute(dto: GetMatchesDto): Promise<ResponseEntity> {
        return this.repository.getAll(dto)
    }

}