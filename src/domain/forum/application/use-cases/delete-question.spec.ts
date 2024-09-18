import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository =
            new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)

        sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
    })

    it('Should be able to Delete a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('question-1')
        )

        await inMemoryQuestionRepository.create(newQuestion)

        inMemoryQuestionAttachmentRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),

            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
        })

        expect(inMemoryQuestionRepository.items).toHaveLength(0)
        expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0)
    })

    it('Should not be able to Delete a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1'),

        },

            new UniqueEntityID('question-1')
        )

        await inMemoryQuestionRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
