import { AuthDto } from "../../dtos";
import { AuthEntity } from "../../entities/auth.entity";

export abstract class AuthDatasource {
    
    abstract login(authDto: AuthDto):Promise<AuthEntity>
}