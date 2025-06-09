import { Router } from "express";
import { TeamDatasourceImpl } from "../../infrastructure/datasource/team/team.datasource.impl";
import { TeamRepositoryImpl } from "../../infrastructure/repositories/team/team.repository.impl";
import { TeamController } from "./controller";
import { CheckPermissionMiddleware } from "../middlewares";

export class TeamRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new TeamDatasourceImpl();
        const repository = new TeamRepositoryImpl(datasource);
        const controller = new TeamController(repository);

        router.get('/', CheckPermissionMiddleware.execute('read'), controller.getAll)
        router.post('/', CheckPermissionMiddleware.execute('create'), controller.create)
        router.put('/:id', CheckPermissionMiddleware.execute('update'), controller.update)


        return router;
    }
}