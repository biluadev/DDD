import { FetchQuestionCommentsUseCase } from './fetch-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Questions Comments', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
    })

    it('Should be able to fetch recent questions', async () => {
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ 
            questionId: new UniqueEntityID('question-1') 
        }))
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ 
            questionId: new UniqueEntityID('question-1') 
        }))
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ 
            questionId: new UniqueEntityID('question-1') 
        }))

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect (result.value?.questionComments).toHaveLength(3)
    })

    it('Should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i ++) {
            await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
                questionId: new UniqueEntityID('question-1'),
            }))
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.questionComments).toHaveLength(2)
    })
})
