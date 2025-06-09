import { UpdateRoleDto } from "../../dtos/role/update.dto";
import { RoleEntity } from "../../entities/role.entity";
import { RoleRepository } from "../../repositories/role/role.repository";

export interface UpdateUseCase {
    execute(dto: UpdateRoleDto): Promise<RoleEntity>
}

export class UpdateRole implements UpdateUseCase {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(dto: UpdateRoleDto): Promise<RoleEntity> {
        return this.roleRepository.update(dto)
    }
}