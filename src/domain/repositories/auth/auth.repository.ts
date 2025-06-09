import { AuthDto } from "../../dtos";
import { AuthEntity } from "../../entities/auth.entity";

export abstract class AuthRepository {
    
    abstract login(authDto: AuthDto):Promise<AuthEntity>
}