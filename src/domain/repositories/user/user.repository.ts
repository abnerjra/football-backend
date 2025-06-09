import { CreateUserDto } from "../../dtos/user/create.dto";
import { UpdateUserDto } from "../../dtos/user/update.dto";
import { UserEntity } from "../../entities/user.entity";

export abstract class UserRepository {
    abstract getAll(): Promise<UserEntity[]>

    abstract getById(id: number): Promise<UserEntity>

    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>

    abstract update(updateUserDto: UpdateUserDto): Promise<UserEntity>
}