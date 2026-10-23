import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { parsePagination } from "../pagination";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
		if (page === undefined && limit === undefined) {
			return this.usersService.findAll();
		}
		return this.usersService.findPage(parsePagination(page, limit));
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.usersService.findById(Number(id));
	}

	@Post()
	create(@Body() body: { name: string; email: string; phone?: string }) {
		return this.usersService.create(body);
	}
}
