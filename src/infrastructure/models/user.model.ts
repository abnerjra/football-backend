import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../data/postgres";

interface UserHasRole {
    id: number,
    name: string,
    key: string
}

export class UserModel {
    static async handleRoleAssignment(
        tx: Prisma.TransactionClient,
        userId: number,
        rolesToAssign: number[]
    ): Promise<void> {
        const existsRoles = await tx.roles.findMany({
            where: { id: { in: rolesToAssign } }
        });

        if (existsRoles.length !== rolesToAssign.length) {
            throw new Error('The roles provided do not belong to the system role catalog');
        }

        const currentRoles = await tx.userHasRole.findMany({
            where: { userId },
            select: { roleId: true }
        });

        const currentRoleIds = currentRoles.map(r => r.roleId);

        const rolesToRemove = currentRoleIds.filter(id => !rolesToAssign.includes(id));
        const rolesToAdd = rolesToAssign.filter(id => !currentRoleIds.includes(id));

        if (rolesToRemove.length) {
            await tx.userHasRole.deleteMany({
                where: {
                    userId,
                    roleId: { in: rolesToRemove }
                }
            });
        }

        if (rolesToAdd.length) {
            const userRolesToAdd = rolesToAdd.map(roleId => ({
                userId,
                roleId
            }));

            await tx.userHasRole.createMany({ data: userRolesToAdd });
        }
    }

    static hasRole = async (userId: number): Promise<UserHasRole[]> => {
        const userHasRoles = await prisma.userHasRole.findMany({
            where: { userId: userId },
            select: {
                role: { select: { id: true, name: true, key: true } }
            },
            orderBy: {
                roleId: 'asc'
            }
        })

        return userHasRoles.map(roleRelation => roleRelation.role)
    }
}
