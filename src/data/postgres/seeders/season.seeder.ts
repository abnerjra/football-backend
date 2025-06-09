import { prisma } from "..";

export class SeasonSeeder {
    private readonly className: string
    constructor() {
        this.className = this.constructor.name
    }

    private readonly seasons = [
        {
            name: '2023/24',
            active: true
        }, {
            name: '2024/25',
            active: false
        }
    ]

    seed = async () => {
        let cont = 0;

        for (const season of this.seasons) {
            const exists = await prisma.season.findFirst({ where: { name: season.name } });
            if (!exists) {
                await prisma.season.create({ data: season })
                cont++;
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.seasons.length}`);
    }
}