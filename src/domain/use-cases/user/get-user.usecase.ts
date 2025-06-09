import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user/user.repository";

export interface GetUserUseCase {
    execute(id: number): Promise<UserEntity>
}

export class GetUser implements GetUserUseCase {
    constructor(private readonly repository: UserRepository) { }

    async execute(id: number): Promise<UserEntity> {
        return this.repository.getById(id)
    }

}