import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres"

interface PermissionMap {
    action: string,
    name: string
}

export class ModuleModel {
    static hasPermission = async (moduleId: number): Promise<PermissionMap[] | undefined> => {
        const modulePermissions = await prisma.catModule.findUnique({
            where: { id: moduleId },
            include: {
                permissionsModule: {
                    include: {
                        permissionList: {
                            select: {
                                key: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        const permissions = modulePermissions?.permissionsModule.map(pm => ({
            action: pm.permissionList.key,
            name: pm.permissionList.name
        }));
        return permissions
    }

    static handlePermissionsAssignment = async (
        tx: Prisma.TransactionClient,
        moduleId: number,
        permissionsToAssing: string[] | undefined
    ): Promise<void> => {
        if (permissionsToAssing !== undefined) {
            const currentPermissions = await tx.permissionModule.findMany({
                where: { moduleId: moduleId }
            })

            if (!currentPermissions.length) {
                for (const per of permissionsToAssing) {
                    const permission = await tx.catPermissionList.findFirst({ where: { key: per } })
                    await tx.permissionModule.create({ data: { moduleId: moduleId, permissionListId: permission!.id } })
                }
            } else {
                const permissionIds = currentPermissions.map(per => per.permissionListId);
                const permissions = await tx.catPermissionList.findMany({ where: { id: { in: permissionIds } }, select: { key: true } })
                const permissionsKey = permissions.map(per => per.key)
                const permissionToRemove = permissionsKey.filter(per => !permissionsToAssing.includes(per))
                const permissionToAdd = permissionsToAssing.filter(per => !permissionsKey.includes(per))

                if (permissionToRemove.length) {
                    for (const content of permissionToRemove) {
                        const element = await tx.catPermissionList.findFirst({ where: { key: content } })
                        await tx.permissionModule.delete({ where: { moduleId_permissionListId: { moduleId: moduleId, permissionListId: element!.id } } })
                    }
                }

                if (permissionToAdd.length) {
                    for (const content of permissionToAdd) {
                        const element = await tx.catPermissionList.findFirst({ where: { key: content } })
                        await tx.permissionModule.create({ data: { moduleId: moduleId, permissionListId: element!.id } })
                    }
                }
            }
        } else {
            const permissions = await tx.permissionModule.deleteMany({
                where: {
                    moduleId: moduleId
                }
            })
        }
    }
}