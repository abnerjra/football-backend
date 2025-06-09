import { CreateRoleDto } from "../../dtos/role/create.dto";
import { UpdateRoleDto } from "../../dtos/role/update.dto";
import { RoleEntity } from "../../entities/role.entity";

export abstract class RoleRepository {
    abstract getAll(): Promise<RoleEntity[]>;

    abstract getById(id: number): Promise<RoleEntity>;

    abstract create(createRoleDto: CreateRoleDto): Promise<RoleEntity>;

    abstract update(updateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
}