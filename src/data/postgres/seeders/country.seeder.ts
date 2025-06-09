import { prisma } from "..";

export class CountrySeeder {

    private className: string;
    constructor() {
        this.className = this.constructor.name
    }

    private readonly countries = [
        {
            name: 'Inlaterra',
            key: 'ENG',
            active: true
        },
        {
            name: 'Alemania',
            key: 'GER',
            active: true
        },
        {
            name: 'Italia',
            key: 'ITA',
            active: true
        },
    ]

    seed = async () => {
        let cont = 0;
        for (const country of this.countries) {
            const exists = await prisma.country.findFirst({ where: { key: country.key } })

            if (!exists) {
                const confederacy = await prisma.confederacy.findFirst({ where: { key: 'UEFA' } })
                const confederacyId = confederacy!.id;
                await prisma.country.create({ data: { ...country, confederacyId} })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.countries.length}`);
    }

}