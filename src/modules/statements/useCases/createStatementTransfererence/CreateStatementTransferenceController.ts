import { CreateStatementTransferenceUseCase } from './CreateStatementTransferenceUseCase';
import { Request, Response } from "express";
import { container } from 'tsyringe';

export class CreateStatementTransferenceController {
    async execute(request: Request, response: Response): Promise<Response> {
        const { id: user_id } = request.user;
        const { sender_id } = request.params;
        const { amount, description } = request.body;

        const createStatementTransferenceUseCase = container.resolve(CreateStatementTransferenceUseCase);

        createStatementTransferenceUseCase.execute({
            amount,
            description,
            user_id,
            sender_id
        })

        return response.status(201).send();
    }
}