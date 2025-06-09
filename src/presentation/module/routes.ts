import { Router } from "express";
import { ModuleDatasourceImpl } from "../../infrastructure/datasource/module/module.datasource.impl";
import { ModuleRepositoryImpl } from "../../infrastructure/repositories/module/module.repository.impl";
import { ModuleController } from "./controller";
import { CheckPermissionMiddleware } from "../middlewares";

export class ModuleRoutes {
    constructor() { }

    static get routes(): Router {
        const router = Router();

        const datasource = new ModuleDatasourceImpl();
        const repository = new ModuleRepositoryImpl(datasource);
        const controller = new ModuleController(repository);

        router.get('/', CheckPermissionMiddleware.execute('read'), controller.getAll);
        router.get('/:id', CheckPermissionMiddleware.execute('read'), controller.getById);
        router.post('/', CheckPermissionMiddleware.execute('create'), controller.create);
        router.put('/:id', CheckPermissionMiddleware.execute('update'), controller.update);

        return router;
    }
}