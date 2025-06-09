import { UpdateTeamDto } from "../../dtos/team/update.dto";
import { ResponseEntity } from "../../entities/response.entity";
import { TeamRepository } from "../../repositories/team/team.repository";

export interface UpdateTeamUseCase {
    execute(dto: UpdateTeamDto): Promise<ResponseEntity>
}

export class UpdateTeam implements UpdateTeamUseCase {
    constructor(private readonly repository: TeamRepository) { }
    
    execute(dto: UpdateTeamDto): Promise<ResponseEntity> {
        return this.repository.update(dto);
    }
}