import { prisma } from '../index';

type PermissionOptions = {
    name: string,
    action: string,
    module_id: number,
    role_id: number
}

export class RolePermissionSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const permissionList = await prisma.catPermissionList.findMany({ where: { active: true } })
        const moduleRoot = await prisma.catModule.findMany()
        const moduleAdmin = await prisma.catModule.findMany({ where: { key: 'user' } })
        const roleRoot = await prisma.roles.findFirst({ where: { key: 'root' } })
        const roleAdmin = await prisma.roles.findFirst({ where: { key: 'admin' } })

        // build permissions array by role
        // ROLE ROOT
        let permissions: PermissionOptions[] = []
        for (const module of moduleRoot) {
            for (const permission of permissionList) {
                permissions.push({
                    name: `${roleRoot!.key}.${module.key}.${permission.key}`,
                    action: permission.key,
                    module_id: module.id,
                    role_id: roleRoot!.id
                })
            }
        }
        // console.log(permissions);

        // ROLE ADMIN
        for (const module of moduleAdmin) {
            for (const permission of permissionList) {
                permissions.push({
                    name: `${roleAdmin!.key}.${module.key}.${permission.key}`,
                    action: permission.key,
                    module_id: module.id,
                    role_id: roleAdmin!.id
                })
            }
        }
        // console.log(permissions, `\nTotal de registros: ${permissions.length}`);

        // Save DB
        let cont = 0
        for (const permission of permissions) {
            const existPermission = await prisma.permissions.findFirst({ where: { name: permission.name } })
            // console.log(existPermission);

            if (!existPermission) {
                const createdPermission = await prisma.permissions.create({
                    data: {
                        name: permission.name,
                        action: permission.action,
                        moduleId: permission.module_id
                    }
                })

                const existsRelation = await prisma.roleHasPermissions.findFirst({
                    where: {
                        roleId: permission.role_id,
                        permissionId: createdPermission.id
                    }
                })

                if (!existsRelation) {
                    await prisma.roleHasPermissions.create({
                        data: {
                            roleId: permission.role_id,
                            permissionId: createdPermission.id
                        }
                    })
                }
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${permissions.length}`);
    }
}