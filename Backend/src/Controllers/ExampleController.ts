import { Request, Response } from "express";


class Example {

    static ExampleRoute(req: Request, res: Response){
        res.send("Hola zorras");
    }

}

export default Example;