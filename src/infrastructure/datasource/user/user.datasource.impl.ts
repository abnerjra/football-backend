import { prisma } from "../../../data/postgres";
import { UserDatasource } from "../../../domain/datasource/user/user.datasource";
import { CreateUserDto } from "../../../domain/dtos/user/create.dto";
import { UpdateUserDto } from "../../../domain/dtos/user/update.dto";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserModel } from "../../models/user.model";

export class UserDatasourceImpl implements UserDatasource {
    async getAll(): Promise<UserEntity[]> {
        const users = await prisma.user.findMany();
        if (!users) throw ('There are no records');

        const usersWithRoles = await Promise.all(
            users.map(async (user) => {
                const roles = await UserModel.hasRole(user.id);
                return UserEntity.fromObject({ ...user, roles });
            })
        );

        return usersWithRoles;
    }

    async getById(id: number): Promise<UserEntity> {
        const user = await prisma.user.findFirst({ where: { id } })
        if (!user) throw ('There is no record');
        const roles = await UserModel.hasRole(user.id)
        return UserEntity.fromObject({ ...user, roles })
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const exists = await prisma.user.findFirst({ where: { email: createUserDto.email } })
        if (exists) throw (`There is already a registered user with the email ${createUserDto.email}`);

        const { roles, ...createUser } = createUserDto!
        try {
            const result = await prisma.$transaction(async (tx) => {
                const user = await tx.user.create({ data: createUser });

                await UserModel.handleRoleAssignment(tx, user.id, roles);

                return user;
            })
            return UserEntity.fromObject(result);
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to create user');
        }
    }

    async update(updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const exists = await prisma.user.findFirst({ where: { email: updateUserDto.email, NOT: { id: updateUserDto.id } } })
        if (exists) throw (`There is already a registered user with the email ${updateUserDto.email}`);

        const { id, roles, ...userUpdate } = updateUserDto;
        try {
            const result = await prisma.$transaction(async (tx) => {
                const user = await tx.user.update({
                    where: { id: id },
                    data: userUpdate
                });

                await UserModel.handleRoleAssignment(tx, user.id, roles);
                return user;
            });
            return UserEntity.fromObject(result)
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof Error) {
                // Devuelve el mensaje original
                throw (error.message);
            }
            throw ('Failed to update user');
        }
    }
}