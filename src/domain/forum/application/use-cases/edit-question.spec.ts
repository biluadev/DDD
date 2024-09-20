import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository =
            new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentRepository)

        sut = new EditQuestionUseCase(
            inMemoryQuestionRepository,
            inMemoryQuestionAttachmentRepository
        )
    })

    it('Should be able to Edit a question', async () => {
        const newQuestion = makeQuestion(
            {
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
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste'
        })

        expect(inMemoryQuestionRepository.items[0].attachments.currentItems
        ).toHaveLength(2)

        expect(
            inMemoryQuestionRepository.items[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
        ]) 
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
            content: 'Conteúdo teste',
            attachmentsIds: []
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
