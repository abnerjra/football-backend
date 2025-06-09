import { Prisma } from "@prisma/client"
import { prisma } from "../../data/postgres"

interface Permission {
    description: string,
    action: string
}

interface PermissionMap {
    [module: string]: Permission[]
}

interface ModulesToAssing {
    module: string,
    permissions: string[]
}

type RequestPermissions = {
    action: string,
    moduleId: number
}

export class RoleModel {
    static hasPermission = async (roleId: number): Promise<PermissionMap> => {
        const options = {
            select: {
                name: true,
                action: true,
                module: {
                    select: {
                        key: true,
                        permissionsModule: {
                            select: {
                                permissionList: {
                                    select: {
                                        name: true,
                                        key: true
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                active: true, // Solo permisos activos
                roleHasPermission: {
                    some: { roleId: roleId }, // Relación con RoleHasPermissions
                }
            }
        }

        const activePermissions = await prisma.permissions.findMany(options)

        const result = activePermissions.map(permission => {
            const matchingPermission = permission.module.permissionsModule.find(pm =>
                pm.permissionList.key.includes(permission.action) // Coincidencia con el `action`
            )

            return {
                action: permission.action,
                moduleKey: permission.module.key,
                description: matchingPermission!.permissionList.name // Nombre del permiso coincidente
            }
        })

        const associatedPermissions: PermissionMap = {}
        for (const element of result) {
            if (!associatedPermissions[element.moduleKey]) {
                associatedPermissions[element.moduleKey] = []
            }

            associatedPermissions[element.moduleKey].push({
                description: element.description,
                action: element.action
            })
        }

        return associatedPermissions
    }

    static handlePermissionsAssignment = async (
        tx: Prisma.TransactionClient,
        roleId: number,
        modulesToAssing: ModulesToAssing[]
    ): Promise<void> => {
        try {
            const currentRole = await tx.roles.findFirst({ where: { id: roleId } })

            const currentPermits = await tx.roleHasPermissions.findMany({
                where: { roleId: roleId }
            })
            const currentPermitsIds = currentPermits.map((element) => element.permissionId)

            const permissionsInBD = await tx.permissions.findMany({
                select: {
                    action: true,
                    moduleId: true
                },
                where: {
                    id: { in: currentPermitsIds }, active: true
                }
            })

            const requestPermissions: RequestPermissions[] = []
            for (const module of modulesToAssing) {
                for (const key of module.permissions) {
                    const moduleDB = await tx.catModule.findFirst({ where: { key: module.module } })
                    requestPermissions.push({ action: key, moduleId: moduleDB!.id })
                }
            }

            const isEqual = (permissionsInBD: RequestPermissions, requestPermissions: RequestPermissions) =>
                permissionsInBD.action === requestPermissions.action &&
                permissionsInBD.moduleId === requestPermissions.moduleId;

            const newPermits = requestPermissions.filter(
                (item2) => !permissionsInBD.some((item1) => isEqual(item1, item2))
            )

            const removedPermits = permissionsInBD.filter(
                (item1) => !requestPermissions.some((item2) => isEqual(item1, item2))
            )

            if (newPermits.length) {
                for (const permit of newPermits) {
                    const moduleName = await tx.catModule.findFirst({
                        where: {
                            id: permit.moduleId
                        }
                    })
                    const permission = {
                        ...permit,
                        name: `${currentRole!.key}.${moduleName!.key}.${permit.action}`
                    }

                    const existPermission = await tx.permissions.findFirst({
                        where: permission
                    })
                    if (existPermission) {
                        await tx.permissions.update({
                            where: { id: existPermission.id },
                            data: { active: true }
                        })

                        const existsRelation = await tx.roleHasPermissions.findFirst({
                            where: { roleId: roleId, permissionId: existPermission.id }
                        })
                        if (!existsRelation) {
                            await tx.roleHasPermissions.create({
                                data: {
                                    roleId: roleId,
                                    permissionId: existPermission.id
                                }
                            })
                        }
                    } else {
                        const newPermission = await tx.permissions.create({
                            data: permission
                        })

                        await tx.roleHasPermissions.create({
                            data: {
                                roleId: roleId,
                                permissionId: newPermission.id
                            }
                        })
                    }
                }
            }

            if (removedPermits.length) {
                for (const permission of removedPermits) {
                    const moduleName = await tx.catModule.findFirst({
                        where: { id: permission.moduleId }
                    })

                    const checkPermission = await tx.permissions.findFirst({
                        where: {
                            ...permission,
                            name: `${currentRole!.key}.${moduleName!.key}.${permission.action}`,
                        }
                    })

                    if (checkPermission) {
                        await tx.permissions.update({
                            where: { id: checkPermission.id },
                            data: { active: false }
                        })

                        await tx.roleHasPermissions.delete({
                            where: {
                                roleId_permissionId: {
                                    roleId: roleId,
                                    permissionId: checkPermission.id
                                }
                            }
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}