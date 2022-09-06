import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseUseCase: CreateStatementUseCase;
let statementRepository: IStatementsRepository;
let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase

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
        getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementRepository);
    });

    it("Should be able to list Statement Operation", async () => {
        const { id: user_id } = await createUserUseCase.execute(requestController);
        const statementOperation = {
            user_id: user_id as string,
            type: OperationType.DEPOSIT,
            amount: 2500.00,
            description: "Pix"
        }

        const { id: statement_id} = await createStatementUseUseCase.execute(statementOperation);

        const bankStatement = await getStatementOperationUseCase.execute({ 
            user_id: user_id as string, 
            statement_id: statement_id as string
        });

        expect(bankStatement).toHaveProperty("id");
        expect(bankStatement).toHaveProperty("user_id");
        expect(bankStatement.type).toBe("deposit");
    })

    it("Should not be able list statement operation if user not found", async () => {
        expect(async () => {
            const { id: user_id } = await createUserUseCase.execute(requestController);
            const statementOperation = {
                user_id: user_id as string,
                type: OperationType.DEPOSIT,
                amount: 2500.00,
                description: "Pix"
            }
    
            const { id: statement_id} = await createStatementUseUseCase.execute(statementOperation);
            await getStatementOperationUseCase.execute({ 
                user_id: "123456", 
                statement_id: statement_id as string
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("Should not be able list statement operation if user not found", async () => {
        expect(async () => {
            const { id: user_id } = await createUserUseCase.execute(requestController);
            const statementOperation = {
                user_id: user_id as string,
                type: OperationType.DEPOSIT,
                amount: 2500.00,
                description: "Pix"
            }
    
            await getStatementOperationUseCase.execute({ 
                user_id: user_id as string,
                statement_id: "123456"
            });
          
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    })
})