import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseUseCase: GetBalanceUseCase;
let statementRepository: IStatementsRepository;
let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
const requestController: ICreateUserDTO = {
    name: "John Doe",
    password: "john@2022",
    email: "john.doe@gmail.com"
}

describe("List statement balance", () => {
    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository();
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
        getBalanceUseUseCase = new GetBalanceUseCase(statementRepository, userRepository);
    });

    it("Should be able list statement balance", async () => {
        const { id } = await createUserUseCase.execute(requestController);
        const balance = await getBalanceUseUseCase.execute({ user_id: id as string });

        expect(balance).toHaveProperty("balance")
        expect(balance.statement).toHaveLength(0);
    });

    it("Should not be able list statement balance if user not exists", async() => {
        expect(async () => {
            const balance = await getBalanceUseUseCase.execute({ user_id: "12345"});
            
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
});