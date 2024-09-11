import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswerRepository()
        sut = new EditAnswerUseCase(inMemoryAnswerRepository)
    })

    it('Should be able to Edit a answer', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-1'),
            },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-1',
            content: 'Conteúdo teste'
        })

        expect(inMemoryAnswerRepository.items[0]).toMatchObject({
            content: 'Conteúdo teste'
        })
    })

    it('Should not be able to Edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-2',
            content: 'Conteúdo teste'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
