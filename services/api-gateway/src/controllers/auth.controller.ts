import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { registerSchema } from "../validations/auth.validation";

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
}
