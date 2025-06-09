import { AuthDatasource } from "../../../domain/datasource/auth/auth.datasource";
import { AuthDto } from "../../../domain/dtos";
import { AuthEntity } from "../../../domain/entities/auth.entity";

export class AuthRepositoryImpl implements AuthDatasource {
    constructor(
        private readonly authDatasource: AuthDatasource
    ){}

    login(authDto: AuthDto): Promise<AuthEntity> {
        return this.authDatasource.login(authDto);
    }
}