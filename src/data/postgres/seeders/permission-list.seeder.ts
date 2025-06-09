import { prisma } from ".."

export class PermissionListSeeder {
    private className: string
    constructor() {
        this.className = this.constructor.name
    }

    private readonly data = [
        {
            name: "Crear",
            key: "create"
        },
        {
            name: "Leer",
            key: "read"
        },
        {
            name: "Actualizar",
            key: "update"
        },
        {
            name: "Eliminar",
            key: "delete"
        }
    ]

    public seed = async () => {

        let cont = 0
        for (const content of this.data) {
            const uniqueKey = await prisma.catPermissionList.findFirst({ where: { key: content.key } })

            if (!uniqueKey) {
                await prisma.catPermissionList.create({ data: content })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.data.length}`);
    }
}