import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { hashPassword, unhashPassword } from "../libs/PasswordsHanler";

const prisma = new PrismaClient();

class UserController {
  static async Register(req: Request, res: Response) {
    //Se destructuran datos del body
    const { email, name, password }: User = req.body;
    //se valida que vengan todos los datos necesarios para el registro
    if (!email || !name || !password) {
      return res.status(402).json({
        message: "Proporcione la Informacion Requerida",
        status: false,
      });
    }
    //se verifica que no exista un usuario con el mismo email
    const findUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!!findUser) {
      return res
        .status(403)
        .json({ message: "Ya hay un usuario con este email", status: false });
    }
    //Si todo esta bien se pone el email en minisculas y se hashea la password
    const data = {
      email: email.toLowerCase(),
      name,
      password: await hashPassword(password),
    };
    //Se crea el nuevo usuario
    const newUser = await prisma.user.create({ data });
    //Si no se crea el usuario se retorna un error
    if (!newUser) {
      return res.status(501).json({
        message: "Error Inesperado, intentelo mas tarde",
        status: false,
      });
    } //Sino se agrega
    return res
      .status(201)
      .json({ message: "Usuario Creado Correctamente", status: true });
  }

  static async Login(req: Request, res: Response) {
    const { email, password }: User = req.body;
    if (!email || !password) {
      return res
        .status(402)
        .json({ message: "Proporcione la Informacion Requerida" });
    }
    const findUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "el usuario no ha sido registrado aún" });
    }
    const PasswordsHanler = await unhashPassword(password, findUser.password);
    if (!PasswordsHanler) {
      return res.status(403).json({ message: "Email o Contraseña Incorrecta" });
    }
    const user = {
      id: findUser.id,
      email: findUser.email,
      name: findUser.name,
    };
    return res.status(200).send(user);
  }
}

export default UserController;
