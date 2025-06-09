import { CreateTeamDto } from "../../dtos/team/create.dto";
import { GetTeamsDto } from "../../dtos/team/get-teams.dto";
import { UpdateTeamDto } from "../../dtos/team/update.dto";
import { ResponseEntity } from "../../entities/response.entity";

export abstract class TeamRepository {
    abstract getAll(dto: GetTeamsDto):Promise<ResponseEntity>

    abstract create(dto: CreateTeamDto):Promise<ResponseEntity>

    abstract update(dto: UpdateTeamDto):Promise<ResponseEntity>
}