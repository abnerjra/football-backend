import { UpdateUserDto } from '../../dtos/user/update.dto';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from "../../repositories/user/user.repository";

export interface UpdateUseCase {
    execute(dto: UpdateUserDto): Promise<UserEntity>
}

export class UpdateUserUseCase implements UpdateUseCase {
    constructor(private readonly repository: UserRepository) { }


    async execute(dto: UpdateUserDto): Promise<UserEntity> {
        return this.repository.update(dto);
    }

}