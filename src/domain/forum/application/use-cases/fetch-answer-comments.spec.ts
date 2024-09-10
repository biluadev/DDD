import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answers Comments', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
    })

    it('Should be able to fetch recent answers', async () => {
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ 
            answerId: new UniqueEntityID('answer-1') 
        }))
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ 
            answerId: new UniqueEntityID('answer-1') 
        }))
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ 
            answerId: new UniqueEntityID('answer-1') 
        }))

        const { answerComments } = await sut.execute({
            answerId: 'answer-1',
            page: 1,
        })

        expect (answerComments).toHaveLength(3)
    })

    it('Should be able to fetch paginated recent answers', async () => {
        for (let i = 1; i <= 22; i ++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
                answerId: new UniqueEntityID('answer-1'),
            }))
        }

        const { answerComments } = await sut.execute({
            answerId: 'answer-1',
            page: 2
        })

        expect(answerComments).toHaveLength(2)
    })
})
