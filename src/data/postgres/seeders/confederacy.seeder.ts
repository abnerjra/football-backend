import { prisma } from "..";

export class ConfederacySeeder {

    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    private readonly confederations = [
        {
            name: 'Unión Europea de Asociaciones de Fútbol',
            key: 'UEFA',
            active: true
        },
        {
            name: 'Confederación de Norteamérica, Centroamérica y el Caribe de Fútbol Asociación',
            key: 'CONCACAF',
            active: true
        }
    ]

    seed = async () => {
        let cont = 0;
        for (const country of this.confederations) {
            const exists = await prisma.confederacy.findFirst({ where: { key: country.key } })

            if (!exists) {
                await prisma.confederacy.create({ data: country })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.confederations.length}`);
    }

}