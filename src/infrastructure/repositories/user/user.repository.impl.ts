import { UserDatasource } from "../../../domain/datasource/user/user.datasource";
import { CreateUserDto } from "../../../domain/dtos/user/create.dto";
import { UpdateUserDto } from "../../../domain/dtos/user/update.dto";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user/user.repository";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly datasource: UserDatasource) { }

    getAll(): Promise<UserEntity[]> {
        return this.datasource.getAll();
    }

    getById(id: number): Promise<UserEntity> {
        return this.datasource.getById(id);
    }

    create(createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.datasource.create(createUserDto);
    }

    update(updateUserDto: UpdateUserDto): Promise<UserEntity> {
        return this.datasource.update(updateUserDto)
    }

}