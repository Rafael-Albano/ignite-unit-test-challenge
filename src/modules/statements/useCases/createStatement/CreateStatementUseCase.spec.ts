import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseUseCase: CreateStatementUseCase;
let statementRepository: IStatementsRepository;
let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
const requestController: ICreateUserDTO = {
    name: "John Doe",
    password: "john@2022",
    email: "john.doe@gmail.com"
}

describe("Create Statement Operation", () => {
    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository();
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
        createStatementUseUseCase = new CreateStatementUseCase(userRepository, statementRepository);
    });


    it("Should be able create a new statement operation deposit", async () => {
        const { id } = await createUserUseCase.execute(requestController);
        const statementOperation = {
            user_id: id as string,
            type: OperationType.DEPOSIT,
            amount: 2500.00,
            description: "Pix"
        }

        const bankStatement = await createStatementUseUseCase.execute(statementOperation);

        expect(bankStatement).toHaveProperty("id");
        expect(bankStatement.type).toBe("deposit");
    });

    it("Should be able create a new statement operation withdraw", async () => {
        const { id } = await createUserUseCase.execute(requestController);
        await createStatementUseUseCase.execute({
            user_id: id as string,
            type: OperationType.DEPOSIT,
            amount: 2500.00,
            description: "Pix"
        });

        const statementOperation = {
            user_id: id as string,
            type: OperationType.WITHDRAW,
            amount: 500.00,
            description: "Transference"
        }

        const bankStatement = await createStatementUseUseCase.execute(statementOperation);

        expect(bankStatement).toHaveProperty("id");
        expect(bankStatement.type).toBe("withdraw");
    });

    it("Should not be able create statement operation if user not found", async () => {
        expect(async () => {
            
            const statementOperation = {
                user_id: "123456",
                type: OperationType.WITHDRAW,
                amount: 500.00,
                description: "Transference"
            }
    
            await createStatementUseUseCase.execute(statementOperation);
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("Should not be able statement create operation withdraw if balance insufficient", async () => {
        expect(async () => {
            const { id } = await createUserUseCase.execute(requestController);
            const statementOperation = {
                user_id: id as string,
                type: OperationType.WITHDRAW,
                amount: 500.00,
                description: "Transference"
            }
    
            await createStatementUseUseCase.execute(statementOperation);
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

})