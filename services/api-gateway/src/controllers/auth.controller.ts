/// <reference path="../../../../shared/types/express.d.ts" />
import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { registerSchema } from "../validations/auth.validation";
import { loginSchema } from "../validations/auth.validation";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);

    const user = await this.authService.register(
      validatedData.email,
      validatedData.password,
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  };

  login = async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);

    const result = await this.authService.login(
      validatedData.email,
      validatedData.password,
    );

    return res.json({
      success: true,
      data: result,
    });
  };

  profile = async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: req.user,
    });
  };
}
