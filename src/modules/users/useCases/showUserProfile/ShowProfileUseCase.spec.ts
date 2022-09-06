import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
const requestController: ICreateUserDTO = {
    name: "John Doe",
    password: "john@2022",
    email: "john.doe@gmail.com"
}

describe("Show Profile User", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
    });

    it("Should be able to the list profile user", async () => {
        const userCreated = await createUserUseCase.execute(requestController);

        const { id } = userCreated;
        const user = await showUserProfileUseCase.execute(id as string);

        expect(user).toHaveProperty("id");
    })
})