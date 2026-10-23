import type { CreateUser } from "@zapp/types";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto implements CreateUser {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsEmail()
	email!: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	phone?: string;
}
