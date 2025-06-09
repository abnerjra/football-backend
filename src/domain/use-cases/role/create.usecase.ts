import { CreateRoleDto } from "../../dtos/role/create.dto";
import { RoleEntity } from "../../entities/role.entity";
import { RoleRepository } from "../../repositories/role/role.repository";

export interface CreateUseCase {
    execute(dto: CreateRoleDto): Promise<RoleEntity>
}

export class CreateRole implements CreateUseCase {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(dto: CreateRoleDto): Promise<RoleEntity> {
        return this.roleRepository.create(dto)
    }
}