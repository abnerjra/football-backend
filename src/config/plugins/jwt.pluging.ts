import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { envPlugin } from './env.plugin';

const JWT_SECRET = envPlugin.JWT_SECRET;

export class JwtPlugin {
    static async generateToken(
        payload: any,
        duration: SignOptions["expiresIn"] = '1h'
    ): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {

                if (err) return resolve(null);

                resolve(token ?? null)

            });
        })
    }


    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            })
        })
    }

    static decodeRaw(token: string): { iat?: number; exp?: number; } {
        const decoded = jwt.decode(token) as JwtPayload | null;

        if (!decoded || typeof decoded !== 'object') return {};

        const { iat, exp } = decoded;

        return { iat, exp };
    }
}