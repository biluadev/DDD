import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionRepository)
    })

    it('Should be able to Edit a question', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID('author-1'),
            },

            new UniqueEntityID('question-1')
        )

        await inMemoryQuestionRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteúdo teste'
        })

        expect(inMemoryQuestionRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste'
        })
    })

    it('Should not be able to Edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('question-1')
        )

        await inMemoryQuestionRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-2',
            title: 'Pergunta teste',
            content: 'Conteúdo teste'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
