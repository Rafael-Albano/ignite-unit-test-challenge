import { AppError } from './../../../../shared/errors/AppError';
import { IStatementsRepository } from './../../repositories/IStatementsRepository';
import { inject, injectable } from "tsyringe";
import { OperationType, Statement } from "../../entities/Statement";
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    sender_id: string;
    amount: number;
    description: string
}

@injectable()
export class CreateStatementTransferenceUseCase {
    constructor(
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    async execute({ user_id, sender_id, amount, description }: IRequest): Promise<void> {
        const user_receiver = await this.usersRepository.findById(user_id);

        if(!user_receiver) {
            throw new AppError("Destination account not found !");
        }

        const user_sender = await this.usersRepository.findById(sender_id);

        if(!user_sender) {
            throw new AppError("Origin account not Found !");
        }

        const user_sender_account = user_sender.id as string;

        const { balance } = await this.statementsRepository.getUserBalance({ 
            user_id: user_sender_account, 
            with_statement: true 
        });

        if(balance < amount) {
            throw new AppError("Insufficient balance !");
        }
        
        await this.statementsRepository.create({
            user_id: user_sender_account,
            type: OperationType.TRANSFER,
            amount,
            description,
        });

        const statementOperation = await this.statementsRepository.create({
            user_id: user_receiver.id as string,
            type: OperationType.TRANSFER,
            amount,
            description,
        });
    }
}