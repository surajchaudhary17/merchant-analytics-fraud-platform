import bcrypt from "bcryptjs";

import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  private userRepository = new UserRepository();

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      role: "merchant",
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
