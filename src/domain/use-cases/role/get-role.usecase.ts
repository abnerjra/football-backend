import { RoleEntity } from "../../entities/role.entity";
import { RoleRepository } from "../../repositories/role/role.repository";

export interface GetRoleUseCase {
    execute(id: number): Promise<RoleEntity>
}

export class GetRole implements GetRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(id: number): Promise<RoleEntity> {
        return this.roleRepository.getById(id)
    }
}