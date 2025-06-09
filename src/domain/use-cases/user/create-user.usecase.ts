import { CreateUserDto } from "../../dtos/user/create.dto";
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from "../../repositories/user/user.repository";

export interface CreateUseCase {
    execute(dto: CreateUserDto): Promise<UserEntity>
}

export class CreateUserUseCase implements CreateUseCase {
    constructor(private readonly repository: UserRepository) { }


    async execute(dto: CreateUserDto): Promise<UserEntity> {
        return this.repository.create(dto);
    }

}