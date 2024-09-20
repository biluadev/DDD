import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-send-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationRepository)
    })

    it('Should be able to send a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'Nova notificação',
            content: 'Conteúdo notificação',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationRepository.items[0]).toEqual(result.value?.notification)
    })
})
