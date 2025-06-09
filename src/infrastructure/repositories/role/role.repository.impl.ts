import { RoleDatasource } from "../../../domain/datasource/role/role.datasource";
import { CreateRoleDto } from "../../../domain/dtos/role/create.dto";
import { UpdateRoleDto } from "../../../domain/dtos/role/update.dto";
import { RoleEntity } from "../../../domain/entities/role.entity";
import { RoleRepository } from "../../../domain/repositories/role/role.repository";

export class RoleRepositoryImpl implements RoleRepository {
    constructor(private readonly datasource: RoleDatasource) {}
    
    getAll(): Promise<RoleEntity[]> {
        return this.datasource.getAll();
    }
    
    getById(id: number): Promise<RoleEntity> {
        return this.datasource.getById(id);
    }
    
    create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
        return this.datasource.create(createRoleDto);
    }
    
    update(updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
        return this.datasource.update(updateRoleDto);
    }
}