import { prisma } from "..";

type PermissionModule = {
    module_id: number,
    permission_list_id: number
}

export class PermissionModuleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const modules = await prisma.catModule.findMany({ where: { active: true } })
        const permissionList = await prisma.catPermissionList.findMany({ where: { active: true } })

        let permissionModule: PermissionModule[] = []
        for (const module of modules) {
            for (const permission of permissionList) {
                permissionModule.push({
                    module_id: module.id,
                    permission_list_id: permission.id
                })
            }
        }

        let cont = 0
        for (const content of permissionModule) {
            const exists = await prisma.permissionModule.findFirst({
                where: {
                    moduleId: content.module_id,
                    permissionListId: content.permission_list_id
                }
            })

            if (!exists) {
                await prisma.permissionModule.create({
                    data: { moduleId: content.module_id, permissionListId: content.permission_list_id }
                })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${permissionModule.length}`);
    }
}