import { Request, Response } from "express";
import { RoleRepository } from "../../domain/repositories/role/role.repository";
import { GetRoles } from "../../domain/use-cases/role/get-roles.usecase";
import { GetRole } from "../../domain/use-cases/role/get-role.usecase";
import { CreateRole } from "../../domain/use-cases/role/create.usecase";
import { CreateRoleDto } from "../../domain/dtos/role/create.dto";
import { UpdateRoleDto } from "../../domain/dtos/role/update.dto";
import { UpdateRole } from "../../domain/use-cases/role/update.usecase";

export class RoleController {
    // DI
    constructor(
        private readonly repository: RoleRepository
    ) { }

    getAll = (req: Request, res: Response) => {
        new GetRoles(this.repository).execute()
            .then(roles => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: roles
                })
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
            });
    }

    getById = (req: Request, res: Response) => {
        const id = +req.params.id
        new GetRole(this.repository).execute(id)
            .then(role => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: role
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
        const [error, createRoleDto] = CreateRoleDto.create(req.body);
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new CreateRole(this.repository).execute(createRoleDto!)
            .then(role => {
                res.status(201).json({
                    severity: 'success',
                    message: 'Rocord created',
                    data: role
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
        const id = +req.params.id
        const [error, updateRoleDto] = UpdateRoleDto.create({ ...req.body, id });
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new UpdateRole(this.repository).execute(updateRoleDto!)
            .then(role => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Rocord updated',
                    data: role
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