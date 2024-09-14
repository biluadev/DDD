import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = 
        new InMemoryQuestionAttachmentRepository
        inMemoryQuestionRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentRepository)
            
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
    })

    it('Should be able to fetch recent questions', async () => {
        await inMemoryQuestionRepository.create(
            makeQuestion({ createdAt: new Date (2022, 0, 20) }),
        )
        await inMemoryQuestionRepository.create(
            makeQuestion({ createdAt: new Date (2022, 0, 18) }),
        )
        await inMemoryQuestionRepository.create(
            makeQuestion({ createdAt: new Date (2022, 0, 23) }),
        )

        const result = await sut.execute({
            page: 1,
        })

        expect (result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ])
    })

    it('Should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i ++) {
            await inMemoryQuestionRepository.create(makeQuestion())
        }

        const result = await sut.execute({
            page: 2,
        })

        expect(result.value?.questions).toHaveLength(2)
    })
})
