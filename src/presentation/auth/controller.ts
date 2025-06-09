import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth/auth.repository";
import { AuthDto } from "../../domain/dtos";
import { AuthUseCase } from "../../domain/use-cases/auth/auth.usecase";

export class AuthController {
    // * Dependecy Inyection
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    public login = (req: Request, res: Response) => {
        const [error, authDto] = AuthDto.create(req.body)
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new AuthUseCase(this.authRepository).execute(authDto!)
            .then((auth) => {
                res.status(200).json({
                    severity: 'success',
                    message: 'User login',
                    data: auth
                });
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error,
                    data: null
                });
            });
    }
}