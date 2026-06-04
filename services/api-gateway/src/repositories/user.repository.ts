import { postgresPool } from "@shared/database/postgres";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: string;
}

export class UserRepository {
  async findByEmail(email: string) {
    const result = await postgresPool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    return result.rows[0];
  }

  async create(input: CreateUserInput) {
    const result = await postgresPool.query(
      `
      INSERT INTO users (
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [input.email, input.passwordHash, input.role],
    );

    return result.rows[0];
  }
}
