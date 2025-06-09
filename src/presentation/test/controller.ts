import { Request, Response } from "express";

export class TestController {
    // Dependency Injection
    constructor() { }

    public getDate = (req: Request, res: Response) => {
        res.status(200).json({
            severity: 'success',
            message: 'Date and time 1',
            data: {
                date: new Date()
            }
        })
        return
    }
}