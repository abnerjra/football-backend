import { TeamDatasource } from '../../../domain/datasource/team/team.datasource';
import { CreateTeamDto } from '../../../domain/dtos/team/create.dto';
import { GetTeamsDto } from '../../../domain/dtos/team/get-teams.dto';
import { UpdateTeamDto } from '../../../domain/dtos/team/update.dto';
import { ResponseEntity } from '../../../domain/entities/response.entity';
import { TeamRepository } from '../../../domain/repositories/team/team.repository';

export class TeamRepositoryImpl implements TeamRepository {
    constructor(private readonly datasource: TeamDatasource) { }
    
    getAll(dto: GetTeamsDto): Promise<ResponseEntity> {
        return this.datasource.getAll(dto);
    }
    
    create(dto: CreateTeamDto): Promise<ResponseEntity> {
        return this.datasource.create(dto);
    }

    update(dto: UpdateTeamDto): Promise<ResponseEntity> {
        return this.datasource.update(dto);
    }
}