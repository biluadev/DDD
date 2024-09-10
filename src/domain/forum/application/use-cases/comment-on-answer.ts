import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface CommentOnAnswerUseCaseRequest {
    authorId: string
    answerId: string
    questionId: string // Adicione questionId aqui
    content: string
}

interface CommentOnAnswerUseCaseResponse {
    answerComment: AnswerComment,
}

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerCommentsRepository: AnswerCommentsRepository,
    ) { }

    async execute({
        authorId,
        answerId,
        questionId, // Receba questionId aqui
        content,
    }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            throw new Error('Answer not found!')
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            questionId: new UniqueEntityID(questionId), // Adicione questionId
            content,
        })

        await this.answerCommentsRepository.create(answerComment)

        return {
            answerComment
        }
    }
}
