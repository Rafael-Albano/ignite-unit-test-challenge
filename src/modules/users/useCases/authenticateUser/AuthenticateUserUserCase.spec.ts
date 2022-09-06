import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUseUseCase: CreateUserUseCase;
const requestController: ICreateUserDTO = {
    name: "John Doe",
    password: "john@2022",
    email: "john.doe@gmail.com"
}

describe("Authenticate user", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
        createUseUseCase = new CreateUserUseCase(userRepository)
    });

    it("Should be able authenticate to user", async () => {
        await createUseUseCase.execute(requestController);
        const { email, password } = requestController;
        const userSession = await authenticateUserUseCase.execute({ email, password });

        expect(userSession).toHaveProperty("token");
        expect(userSession.user).toHaveProperty("id");
    });

    it("Should not be able authenticate user if email incorrect", async () => {
        expect(async () => {
            await createUseUseCase.execute(requestController);
            const userWithEmailIncorrect = {
                email: "john.doe@gmail.com",
                password: requestController.password
            }
            await authenticateUserUseCase.execute(userWithEmailIncorrect);
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });

    it("Should not be able authenticate user if password incorrect", async () => {
        expect(async () => {
            await createUseUseCase.execute(requestController);
            const userWithEmailIncorrect = {
                email: requestController.email,
                password: "123456"
            }
            await authenticateUserUseCase.execute(userWithEmailIncorrect);
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });

})