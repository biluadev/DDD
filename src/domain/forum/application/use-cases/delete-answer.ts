import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
    constructor(private answerRepository: AnswersRepository) { }

    async execute({
        authorId,
        answerId
    }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            throw new Error ('Question not found.')
        }

        if (authorId !== answer.authorId.toString()) {
            throw new Error('You are not the author of this question.')
        }

        await this.answerRepository.delete(answer)

        return {}
    }
}
