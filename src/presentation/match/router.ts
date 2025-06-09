import { Router } from "express";
import { MatchController } from "./controller";
import { MatchDatasourceImpl } from "../../infrastructure/datasource/match/math.datasource.impl";
import { MatchRepositoryImpl } from "../../infrastructure/repositories/match/match.repository.impl";
import { CheckPermissionMiddleware } from "../middlewares";

export class MatchRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new MatchDatasourceImpl();
        const repository = new MatchRepositoryImpl(datasource);
        const controller = new MatchController(repository);

        router.get('/', CheckPermissionMiddleware.execute('read'), controller.getAll)
        router.post('/', CheckPermissionMiddleware.execute('create'), controller.create)
        router.post('/simulate', CheckPermissionMiddleware.execute('create'), controller.simulate)

        return router;
    }
}