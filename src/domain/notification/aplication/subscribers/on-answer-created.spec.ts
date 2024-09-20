import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository"
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository"
import { OnAnswerCreated } from "./on-answer-created"
import { makeAnswer } from "test/factories/make-answer"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-send-notification-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { makeQuestion } from "test/factories/make-question"
import { waitFor } from "test/utils/wait-for"

interface SpyInstance <TArgs extends any[] = any[], TReturns = any > 
extends MockInstance<TArgs, TReturns> {}

interface MockInstance <TArgs extends any[] = any[], TReturns = any> {}

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
    [SendNotificationUseCaseRequest],
    Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = 
        new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository
        )

        inMemoryAnswerAttachmentsRepository = 
        new InMemoryAnswerAttachmentRepository()
        inMemoryAnswerRepository = new InMemoryAnswerRepository(
            inMemoryAnswerAttachmentsRepository
        )

        inMemoryNotificationsRepository = 
        new InMemoryNotificationsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository
        )

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
    })

    it('should send a notification when an answer is created', async() => {
        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswerRepository.create(answer)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})
