import {
    BcryptPlugin,
    JwtPlugin,
    AuthToken
} from "../../../config";
import { prisma } from "../../../data/postgres";
import { AuthDatasource } from "../../../domain/datasource/auth/auth.datasource";
import { AuthDto } from "../../../domain/dtos";
import { AuthEntity } from "../../../domain/entities/auth.entity";
import { UserModel } from "../../models/user.model";

type AuthTokenOptions = {
    token: string,
    userId: number,
    createdAt: number
    expiresAt: number
}

export class AuthDatasourceImpl implements AuthDatasource {
    async login(authDto: AuthDto): Promise<AuthEntity> {
        const { email, password } = authDto;

        // TODO: Validate user
        const user = await prisma.user.findFirst({
            where: { email },
            include: {
                userHasRole: {
                    include: {
                        role: true
                    }
                }
            }
        })

        if (!user) throw (`User with email ${email} not found`)
        if (!user.active) throw (`The user account is disabled and login is not possible.`)

        // TODO: Compare password
        const isValidPassword = BcryptPlugin.compare({ password, hash: user.password })
        if (!isValidPassword) throw ('invalid credentials');

        // TODO: Get roles
        const roles = await UserModel.hasRole(user.id);

        // TODO: Generate JWT
        let token = await AuthToken.verifyToken(user.id);
        let iat: number;
        let exp: number;

        if (!token) {
            token = await JwtPlugin.generateToken({ id: user.id, email: user.email })
            if (!token) throw ('Failed to generate token')

            const { iat: createdAt, exp: expiresAt } = JwtPlugin.decodeRaw(token);
            iat = createdAt!;
            exp = expiresAt!;
            // TODO: Save data token in auth_token
            const saveAuthToken: AuthTokenOptions = {
                token: token,
                userId: user.id,
                createdAt: iat!,
                expiresAt: exp!
            }
            await prisma.authToken.create({ data: saveAuthToken })
        } else {
            const { iat: createdAt, exp: expiresAt } = JwtPlugin.decodeRaw(token);
            iat = createdAt!;
            exp = expiresAt!;
        }

        return AuthEntity.fromObject({ ...user, token, iat, exp, roles })
    }
}