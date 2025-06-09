import { prisma } from "..";

export class ModuleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    private readonly modules = [
        {
            name: 'Usuarios',
            key: 'user',
            description: 'Módulo de usuarios'
        },
        {
            name: 'Roles y permisos',
            key: 'role',
            description: 'Módulo de roles y permisos'
        },
        {
            name: 'Paises',
            key: 'country',
            description: 'Registro de paises'
        },
        {
            name: 'Ligas',
            key: 'league',
            description: 'Registro de ligas de fútbol'
        },
        {
            name: 'Equipos',
            key: 'team',
            description: 'Registro de equipos'
        },
        {
            name: 'Partidos',
            key: 'match',
            description: 'Partidos'
        },
        {
            name: 'Posiciones',
            key: 'standings',
            description: 'Tabla general de posiciones'
        }
    ]

    public seed = async () => {
        let cont = 0
        for (const content of this.modules) {
            const uniqueKey = await prisma.catModule.findFirst({ where: { key: content.key } })

            if (!uniqueKey) {
                await prisma.catModule.create({ data: content })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.modules.length}`);
    }
}