import { envPlugin } from "./config"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"

(async () => {
    main()
})()

function main() {
    const server = new Server({
        port: envPlugin.PORT,
        routes: AppRoutes.routes,
        publicPath: envPlugin.PUBLIC_PATH
    })
    server.start()
}