import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();


class UserController {
    static async Register(req: Request, res: Response) {
        const { email, name, password }: User = req.body;
        if(!email || !name || !password){
            return res.status(403).json({ message: "Proporcione la Informacion Requerida" });
        }
        const findUser = await prisma.user.findFirst({where: {email: email.toLowerCase()}});
        if(!!findUser) {
            return res.status(403).json({ message: "Ya hay un usuario con este email" });
        }
        const salt = genSaltSync(10);
        const passHash = hashSync(password, salt);
        const data = {
            email: email.toLowerCase(),
            name,
            password: passHash,
        };
        const newUser = await prisma.user.create({data});
        if(!newUser){
           return res.status(403).json({message: "Error Inesperado, intentelo mas tarde"});
        }
        return res.status(201).json({ message: "Usuario Creado Correctamente", user: newUser });
        // const passHas
    }

    static async Login(req: Request, res: Response) {
        
    }
}

export default UserController;
