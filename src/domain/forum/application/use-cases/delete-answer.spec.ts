import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswerRepository()
        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
    })

    it('Should be able to Delete a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        })

        expect(inMemoryAnswerRepository.items).toHaveLength(0)
    })

    it('Should not be able to Delete a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        await expect(() => {
            return sut.execute({
                answerId: 'answer-1',
                authorId: 'author-2'
            })
        }).rejects.toBeInstanceOf(Error)
    })
})
