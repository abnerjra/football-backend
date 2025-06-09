import { Router } from "express";
import { StandingController } from "./controller";
import { StandingDatasourceImpl } from "../../infrastructure/datasource/standings/standing.datasource.impl";
import { StandingRepositoryImpl } from "../../infrastructure/repositories/standings/standing.repository.impl";

export class StandingRoutes {
    static get routes():Router{
        const router = Router();

        const datasource = new StandingDatasourceImpl();
        const repository = new StandingRepositoryImpl(datasource);
        const controller = new StandingController(repository);

        router.get('/', controller.getAll)

        return router;
    }
}