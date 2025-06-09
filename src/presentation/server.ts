import express, { Request, Response, Router } from "express";
import path from "path";

interface ServerOptions {
    port: number,
    routes: Router,
    publicPath: string
}

export class Server {
    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: ServerOptions) {
        const { port, routes, publicPath } = options
        this.port = port;
        this.routes = routes;
        this.publicPath = publicPath
    }

    async start() {
        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        //* Public folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes)

        this.app.get('/{*split}', (req: Request, res: Response) => {
            console.log(req.url);
            const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
            return
        });

        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}