import { prisma } from "..";

export class RoleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const data = [
            {
                name: 'ROL ROOT',
                key: 'root',
                description: 'Superadministrador'
            },
            {
                name: 'ROL ADMINISTRADOR',
                key: 'admin',
                description: 'Administrador'
            }
        ]

        let cont = 0
        for (const content of data) {
            const uniqueKey = await prisma.roles.findFirst({ where: { key: content.key } })

            if (!uniqueKey) {
                await prisma.roles.create({ data: content })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}