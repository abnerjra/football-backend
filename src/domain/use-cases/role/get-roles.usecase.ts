import { RoleEntity } from "../../entities/role.entity";
import { RoleRepository } from "../../repositories/role/role.repository";

export interface GetRolesUseCase {
    execute(): Promise<RoleEntity[]>
}

export class GetRoles implements GetRolesUseCase {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(): Promise<RoleEntity[]> {
        return this.roleRepository.getAll()
    }
}