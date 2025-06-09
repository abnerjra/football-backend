import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/user.model";
import { prisma } from "../../data/postgres";

export class CheckPermissionMiddleware {
    static execute(validPermission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const auth = (req as any).auth;
            const prefix = req.baseUrl.split('/').at(3) ?? ''

            const associatedRoles = await UserModel.hasRole(auth.id);
            const rolesIds = associatedRoles.map(role => role.id);

            const rolePermissions = await prisma.roleHasPermissions.findMany({
                where: { roleId: { in: rolesIds } }
            })
            const permissionIds = rolePermissions.map(permission => permission.permissionId)

            const permissions = await prisma.permissions.findMany({
                select: { name: true },
                where: { id: { in: permissionIds } }
            })

            const userPermissions = permissions.map(permission => permission.name)

            const requiredPermission = associatedRoles.map(role => `${role.key}.${prefix}.${validPermission}`            )

            const hasPermission = requiredPermission.some(rp => userPermissions.includes(rp))

            if (!hasPermission) {
                res.status(403).json({
                    severity: 'error',
                    message: 'You do not have permission to perform any action'
                })
                return
            }

            next();
        }
    }
}