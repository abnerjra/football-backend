import { prisma } from "../../../data/postgres";
import { ModuleDatasource } from "../../../domain/datasource/module/module.datasource";
import { CreateModuleDto } from "../../../domain/dtos/module/create.dto";
import { UpdateModuleDto } from "../../../domain/dtos/module/update.dto";
import { ModuleEntity } from '../../../domain/entities/module.entity';
import { ModuleModel } from "../../models/module.model";

export class ModuleDatasourceImpl implements ModuleDatasource {
    async getAll(): Promise<ModuleEntity[]> {
        const modules = await prisma.catModule.findMany();
        if (!modules) throw ('There is no records');

        const moduleWithPermissions = Promise.all(
            modules.map(async (module) => {
                const permissions = await ModuleModel.hasPermission(module.id)
                console.log({ permissions })
                return ModuleEntity.fromJson({ ...module, permissions })
            })
        )

        return moduleWithPermissions
    }

    async getById(id: number): Promise<ModuleEntity> {
        const module = await prisma.catModule.findUnique({ where: { id: id } })
        if (!module) throw ('There is no records');

        const permissions = await ModuleModel.hasPermission(module.id)
        return ModuleEntity.fromJson({ ...module, permissions })
    }

    async create(createModuleDto: CreateModuleDto): Promise<ModuleEntity> {
        const { name, key } = createModuleDto
        const existsName = await prisma.catModule.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        })

        if (existsName) throw (`A module with the ${name} already exists`)

        const existsKey = await prisma.catModule.findFirst({
            where: {
                key: {
                    equals: key,
                    mode: 'insensitive'
                }
            }
        })

        if (existsKey) throw (`A module with the ${key} already exists`);

        const { permissions, ...moduleData } = createModuleDto
        try {
            const result = await prisma.$transaction(async (tx) => {
                const module = await tx.catModule.create({ data: moduleData })
                await ModuleModel.handlePermissionsAssignment(tx, module.id, permissions)
                return module
            })
            const permissionList = await ModuleModel.hasPermission(result.id)
            return ModuleEntity.fromJson({ ...result, permissions: permissionList })
        } catch (error) {
            console.error('Error creating module:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to create module');
        }
    }

    async update(updateModuleDto: UpdateModuleDto): Promise<ModuleEntity> {
        try {
            const { name } = updateModuleDto
            const existsName = await prisma.catModule.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    ...(updateModuleDto.id && {
                        id: { not: Number(updateModuleDto.id) }
                    })
                }
            })
            if (existsName) throw (`A module with the ${name} already exists`)

            const { id, permissions, ...updateData } = updateModuleDto

            const result = await prisma.$transaction(async (tx) => {
                const module = await tx.catModule.update({ where: { id: Number(updateModuleDto.id) }, data: updateData })
                await ModuleModel.handlePermissionsAssignment(tx, module.id, permissions)
                return module
            })

            const listPermissions = await ModuleModel.hasPermission(result.id)
            return ModuleEntity.fromJson({ ...result, permissions: listPermissions })
        } catch (error) {
            console.error('Error updating module:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to update module');
        }
    }

}