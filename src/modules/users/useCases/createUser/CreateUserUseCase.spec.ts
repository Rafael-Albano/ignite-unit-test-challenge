import { ICreateUserDTO } from './ICreateUserDTO';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { CreateUserError } from './CreateUserError';
import { rejects } from 'assert';

let inMemoryUserRepository: IUsersRepository
let createUserUseCase: CreateUserUseCase;
const requestController: ICreateUserDTO = {
    name: "John Doe",
    password: "john@2022",
    email: "john.doe@gmail.com"
}

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    })

    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute(requestController);

        expect(user).toHaveProperty("id");
    });

    it("Should not be able to create a new user if same email", async () => {
       expect(async () => {
        await createUserUseCase.execute(requestController);
        
        await createUserUseCase.execute(requestController);
       }).rejects.toBeInstanceOf(CreateUserError)
    });
})