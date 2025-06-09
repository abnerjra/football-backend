import { BcryptPlugin } from "../../../config";
import { prisma } from "..";

export class UserSeeder {
    private className: string;

    constructor() {
        this.className = this.constructor.name
    }

    private readonly users = [
        {
            name: 'User',
            lastName: 'One',
            email: 'user.one@leagues.com',
            acronym: 'AJH',
            active: true
        },
        {
            name: 'User',
            lastName: 'Two',
            email: 'user.two@leagues.com',
            acronym: 'DGA',
            active: true
        }
    ];

    public seed = async () => {
        let cont = 0;
        for (const user of this.users) {
            const exists = await prisma.user.findFirst({ where: { email: user.email } })

            if (!exists) {
                const password = await BcryptPlugin.hash(user.email.split('@')[0])
                await prisma.user.create({ data: { ...user, password } })
                cont++;
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${this.users.length}`);
    }
}