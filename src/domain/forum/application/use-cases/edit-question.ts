import { Question } from '../../enterprise/entities/questions'
import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseRequest {
    authorId: string
    questionId: string
    title: string
    content: string
}

interface EditQuestionUseCaseResponse {
    question: Question
}

export class EditQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        authorId,
        title,
        questionId,
        content
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            throw new Error('Question not found.')
        }

        if (authorId !== question.authorId.toString()) {
            throw new Error('You are not the author of this question.')
        }

        question.title = title
        question.content = content

        await this.questionsRepository.save(question)

        return {
            question
        }
    }
}
