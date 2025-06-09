import { Router } from "express";
import { TestRoutes } from "./test/routes";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./user/routes";
import { RoleRoutes } from "./role/routes";
import { AuthMiddleware } from "./middlewares";
import { ModuleRoutes } from "./module/routes";
import { MatchRoutes } from "./match/router";
import { StandingRoutes } from "./standings/router";
import { TeamRoutes } from "./team/routes";

export class AppRoutes {
    static get routes(): Router {
        const prefix = '/api';
        const version = 'v1';

        const middlewares = [
            AuthMiddleware.execute
        ];

        const router = Router();
        router.use(`${prefix}/${version}`, TestRoutes.routes)

        // Auth
        router.use(`${prefix}/${version}/auth`, AuthRoutes.routes)

        // Route protecteds
        router.use(middlewares);

        // User
        router.use(`${prefix}/${version}/user`, UserRoutes.routes)
        // Role
        router.use(`${prefix}/${version}/role`, RoleRoutes.routes)
        // Module
        router.use(`${prefix}/${version}/module`, ModuleRoutes.routes)
        // Match
        router.use(`${prefix}/${version}/match`, MatchRoutes.routes)
        // Standings
        router.use(`${prefix}/${version}/standing`, StandingRoutes.routes)
        // Team
        router.use(`${prefix}/${version}/team`, TeamRoutes.routes)
        // TODO: register seasons, leagues

        return router;
    }
}