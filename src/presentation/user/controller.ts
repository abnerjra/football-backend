import { Request, Response } from "express";
import { UserRepository } from "../../domain/repositories/user/user.repository";
import { GetUsers } from "../../domain/use-cases/user/get-users.usecase";
import { GetUser } from "../../domain/use-cases/user/get-user.usecase";
import { CreateUserUseCase } from "../../domain/use-cases/user/create-user.usecase";
import { CreateUserDto } from "../../domain/dtos/user/create.dto";
import { UpdateUserDto } from "../../domain/dtos/user/update.dto";
import { UpdateUserUseCase } from "../../domain/use-cases/user/update-user.usecase";

export class UserController {
    // DI
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    getAll = (req: Request, res: Response) => {
        new GetUsers(this.userRepository).execute()
            .then((users) => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: users
                });
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
            });
    }

    getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetUser(this.userRepository).execute(id)
            .then((user) => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: user
                })
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
            });
    }

    create = (req: Request, res: Response) => {
        const [error, createUserDto] = CreateUserDto.create(req.body);

        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new CreateUserUseCase(this.userRepository).execute(createUserDto!)
            .then((user) => {
                res.status(201).json({
                    severity: 'success',
                    message: 'Record created',
                    data: user
                })
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
            });
    }

    update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, id });

        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new UpdateUserUseCase(this.userRepository).execute(updateUserDto!)
            .then((user) => {
                res.status(201).json({
                    severity: 'success',
                    message: 'Record updated',
                    data: user
                })
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
            });
    }
}