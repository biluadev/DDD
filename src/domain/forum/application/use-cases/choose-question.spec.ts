import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUse } from './choose-question-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments'
import { InMemoryAnswerAttachmentRepository } from '@/test/repositories/in-memory-answer-attachment-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: ChooseQuestionBestAnswerUse

describe('choose question best answer Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentRepository()
        inMemoryQuestionAttachmentRepository =
            new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentRepository
        )
        inMemoryAnswerRepository = new InMemoryAnswerRepository(
            inMemoryAnswerAttachmentsRepository
        )

        sut = new ChooseQuestionBestAnswerUse(
            inMemoryQuestionsRepository,
            inMemoryAnswerRepository
        )
    })

    it('Should be able to choose the question best answer', async () => {
        const question = makeQuestion();

        const answer = makeAnswer({
            questionId: question.id,
        });

        await inMemoryQuestionsRepository.create(question);
        await inMemoryAnswerRepository.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString()
        });

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id);
    });


    it('Should not be able to choose another question best answer', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        })

        const answer = makeAnswer({
            questionId: question.id
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswerRepository.create(answer)

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
