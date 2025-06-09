import { CreateTeamDto } from "../../dtos/team/create.dto";
import { ResponseEntity } from "../../entities/response.entity";
import { TeamRepository } from "../../repositories/team/team.repository";

export interface CreateTeamUseCase {
    execute(dto: CreateTeamDto): Promise<ResponseEntity>
}

export class CreateTeam implements CreateTeamUseCase {
    constructor(private readonly repository: TeamRepository) { }
    
    execute(dto: CreateTeamDto): Promise<ResponseEntity> {
        return this.repository.create(dto);
    }
}