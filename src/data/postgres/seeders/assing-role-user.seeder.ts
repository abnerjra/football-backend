import { prisma } from "..";

export class AssignRoleUserSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const roleRoot = await prisma.roles.findFirst({ where: { key: 'root' } })
        const roleAdmin = await prisma.roles.findFirst({ where: { key: 'admin' } })

        const userRoot = await prisma.user.findFirst({ where: { email: 'user.one@leagues.com' } })
        const userAdmin = await prisma.user.findFirst({ where: { email: 'user.two@leagues.com' } })

        const userHasRole = [
            {
                user_id: userRoot!.id,
                role_id: roleRoot!.id
            },
            {
                user_id: userAdmin!.id,
                role_id: roleAdmin!.id
            }
        ]

        let cont = 0
        for (const content of userHasRole) {
            const existsRoleUser = await prisma.userHasRole.findFirst({
                where: {
                    userId: content.user_id,
                    roleId: content.role_id
                }
            })

            if (!existsRoleUser) {
                await prisma.userHasRole.create({ data: { userId: content.user_id, roleId: content.role_id } })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${userHasRole.length}`);
    }
}