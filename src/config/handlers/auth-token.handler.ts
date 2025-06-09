import { prisma } from "../../data/postgres";
import { JwtPlugin } from "../plugins/jwt.pluging";

type AuthTokenRegister = {
    token: string,
    userId: number,
    createdAt: number,
    expiresAt: number
}

export class AuthToken {
    static verifyToken = async (userId: number): Promise<string | null> => {
        const activeToken = await prisma.authToken.findFirst({ where: { userId: userId, revoked: false } })
        if (!activeToken) return null

        const token = activeToken.token;
        const checkToken = await JwtPlugin.validateToken(token);
        if (!checkToken) {
            await prisma.authToken.update({
                where: { token: token },
                data: { revoked: true }
            })
            return null
        }
        return token
    }
}