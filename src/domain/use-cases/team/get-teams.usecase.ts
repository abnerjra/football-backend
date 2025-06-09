import { GetTeamsDto } from "../../dtos/team/get-teams.dto";
import { ResponseEntity } from "../../entities/response.entity";
import { TeamRepository } from "../../repositories/team/team.repository";

export interface GetTeamsUseCase {
    execute(dto: GetTeamsDto): Promise<ResponseEntity>
}

export class GetTeams implements GetTeamsUseCase {
    constructor(private readonly repository: TeamRepository) { }

    execute(dto: GetTeamsDto): Promise<ResponseEntity> {
        return this.repository.getAll(dto)
    }

}