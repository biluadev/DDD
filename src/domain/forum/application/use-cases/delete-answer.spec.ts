import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = 
        new InMemoryAnswerAttachmentRepository()
        inMemoryAnswerRepository = new InMemoryAnswerRepository(
            inMemoryAnswerAttachmentsRepository
        )

        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
    })

    it('Should be able to Delete a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        inMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),

            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        })

        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    })

    it('Should not be able to Delete a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('answer-1')
        )

        await inMemoryAnswerRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
