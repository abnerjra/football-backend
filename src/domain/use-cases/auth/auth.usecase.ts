import { AuthDto } from "../../dtos";
import { AuthEntity } from "../../entities/auth.entity";
import { AuthRepository } from "../../repositories/auth/auth.repository";

export interface AuthUseCase {
    execute(dto: AuthDto): Promise<AuthEntity>
}

export class AuthUseCase implements AuthUseCase {

    constructor(private readonly repository: AuthRepository) { }

    async execute(dto: AuthDto): Promise<AuthEntity> {
        return this.repository.login(dto)
    }
}