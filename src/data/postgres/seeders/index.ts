import { prisma } from "..";
import { AssignRoleUserSeeder } from "./assing-role-user.seeder";
import { ConfederacySeeder } from "./confederacy.seeder";
import { CountrySeeder } from "./country.seeder";
import { LeagueSeasonSeeder } from "./league-season.seeder";
import { LeagueSeeder } from "./league.seeder";
import { ModuleSeeder } from "./module.seeder";
import { PermissionListSeeder } from "./permission-list.seeder";
import { PermissionModuleSeeder } from "./permission-module.seeder";
import { RolePermissionSeeder } from "./role-permission.seeder";
import { RoleSeeder } from "./role.seeder";
import { SeasonSeeder } from "./season.seeder";
import { TeamSeeder } from "./team.seeder";
import { UserSeeder } from "./user.seeder";

type Seeder = {
    seed: () => Promise<void>;
    constructor: { name: string }
};

async function seedDatabase() {
    const seeders: Seeder[] = [
        new UserSeeder(),
        new ModuleSeeder(),
        new PermissionListSeeder(),
        new PermissionModuleSeeder(),
        new RoleSeeder(),
        new RolePermissionSeeder(),
        new AssignRoleUserSeeder(),
        new ConfederacySeeder(),
        new CountrySeeder(),
        new LeagueSeeder(),
        new SeasonSeeder(),
        new LeagueSeasonSeeder(),
        new TeamSeeder(),
    ];

    try {
        console.log("🚀 Start seeding database...");

        for (const seeder of seeders) {
            console.log(`🔹 Running ${seeder.constructor.name}...`);
            await seeder.seed();
        }

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
