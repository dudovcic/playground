import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createValidationPipe } from "./validation";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(createValidationPipe());
	app.enableCors();
	const port = process.env.PORT || 4992;
	await app.listen(port);
	console.log(`API running on http://localhost:${port}`);
}

bootstrap();
