import { Injectable } from "@nestjs/common";
import type { CreateUser, User } from "@zapp/types";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
	constructor(private readonly db: DatabaseService) {}

	findAll() {
		return this.db.query<User>("SELECT * FROM users ORDER BY id ASC");
	}

	findById(id: number) {
		return this.db.get<User>("SELECT * FROM users WHERE id = ?", [id]);
	}

	create(data: CreateUser) {
		const result = this.db.run(
			"INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
			[data.name, data.email, data.phone || null],
		);
		return this.db.get<User>("SELECT * FROM users WHERE id = ?", [
			result.lastInsertRowid,
		]);
	}
}
