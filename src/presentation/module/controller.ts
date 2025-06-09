import { Request, Response } from "express";
import { ModuleRepository } from "../../domain/repositories/module/module.repository";
import { GetModules } from "../../domain/use-cases/module/get-modules.usecase";
import { GetModule } from "../../domain/use-cases/module/get-module.usecase";
import { CreateModule } from "../../domain/use-cases/module/create-module.usecase";
import { CreateModuleDto } from "../../domain/dtos/module/create.dto";
import { UpdateModuleDto } from "../../domain/dtos/module/update.dto";
import { UpdateModule } from "../../domain/use-cases/module/update-module.usecase";

export class ModuleController {
    // DI
    constructor(
        private readonly repository: ModuleRepository
    ) { }

    getAll = (req: Request, res: Response) => {
        new GetModules(this.repository).execute()
            .then(modules => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: modules
                })
                return
            })
            .catch((error) => {
                console.log(error)
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
                return
            });
    }

    getById = (req: Request, res: Response) => {
        const id = +req.params.id
        new GetModule(this.repository).execute(id)
            .then(module => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: module
                })
                return
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
                return
            });
    }

    create = (req: Request, res: Response) => {
        const [error, createModuleDto] = CreateModuleDto.create(req.body)
        console.log({ error, createModuleDto })
        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new CreateModule(this.repository).execute(createModuleDto!)
            .then(module => {
                res.status(201).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: module
                })
                return
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
                return
            });
    }

    update = (req: Request, res: Response) => {
        const id = req.params.id;
        const [error, updateModuleDto] = UpdateModuleDto.create({ ...req.body, id })

        if (error) {
            res.status(400).json({
                severity: 'error',
                message: error,
                data: null
            });
            return;
        }

        new UpdateModule(this.repository).execute(updateModuleDto!)
            .then(module => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Registration information',
                    data: module
                })
                return
            })
            .catch((error) => {
                res.status(400).json({
                    severity: 'error',
                    message: error
                });
                return
            });
    }
}