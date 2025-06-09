import { prisma } from "../../../data/postgres";
import { RoleDatasource } from "../../../domain/datasource/role/role.datasource";
import { CreateRoleDto } from "../../../domain/dtos/role/create.dto";
import { UpdateRoleDto } from "../../../domain/dtos/role/update.dto";
import { RoleEntity } from "../../../domain/entities/role.entity";
import { RoleModel } from "../../models/role.model";

export class RoleDatasourceImpl implements RoleDatasource {
    async getAll(): Promise<RoleEntity[]> {
        const roles = await prisma.roles.findMany();
        if (!roles) throw ('There are no records');

        const rolesWithPermissions = Promise.all(
            roles.map(async (role) => {
                const permissions = await RoleModel.hasPermission(role.id);
                return RoleEntity.fromObject({ ...role, permissions })
            })
        )

        return rolesWithPermissions;
    }

    async getById(id: number): Promise<RoleEntity> {
        const role = await prisma.roles.findFirst({ where: { id } });
        if (!role) throw ('There is no records');

        const permissions = await RoleModel.hasPermission(role.id)

        return RoleEntity.fromObject({ ...role, permissions })
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
        const { name, key } = createRoleDto

        const existsName = await prisma.roles.findFirst({ where: { name: { contains: name } } })
        if (existsName) throw (`A role with the name already exists ${name}`);

        const existsKey = await prisma.roles.findFirst({ where: { key: { contains: key } } })
        if (existsKey) throw (`A role with the key already exists ${key}`);

        const { modules, ...roleData } = createRoleDto;
        try {
            const result = await prisma.$transaction(async (tx) => {
                const role = await tx.roles.create({ data: roleData })

                await RoleModel.handlePermissionsAssignment(tx, role.id, modules)

                return role;
            })
            const permissions = await RoleModel.hasPermission(result.id)
            return RoleEntity.fromObject({ ...result, permissions });
        } catch (error) {
            console.error('Error creating role:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to create role');
        }
    }

    async update(updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
        const { name } = updateRoleDto

        const existsName = await prisma.roles.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                NOT: {
                    id: updateRoleDto.id,
                }
            }
        });
        if (existsName) throw (`A role with the name already exists ${name}`);

        const { modules, ...roleData } = updateRoleDto;
        try {
            const result = await prisma.$transaction(async (tx) => {
                const role = await tx.roles.update({ where: { id: updateRoleDto.id }, data: roleData })
                await RoleModel.handlePermissionsAssignment(tx, role.id, modules)
                return role
            })
            const permissions = await RoleModel.hasPermission(result.id)
            return RoleEntity.fromObject({ ...result, permissions });
        } catch (error) {
            console.error('Error updating role:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to update role');
        }
    }
}