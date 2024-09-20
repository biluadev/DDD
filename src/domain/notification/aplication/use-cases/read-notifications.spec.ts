import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-send-notification-repository'
import { ReadNotificationUseCase } from './read-notifications'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
    })

    it('Should be able to read a notification', async () => {
        const notification = makeNotification()

        inMemoryNotificationRepository.create(notification)

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
            expect.any(Date)    
        )
    })

    it('Should not be able to read a notification from another user', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('recipient-1'),

        })

        await inMemoryNotificationRepository.create(notification)

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
