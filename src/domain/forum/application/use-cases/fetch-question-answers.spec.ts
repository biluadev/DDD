import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@/test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Questions Answers', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswerRepository()
        sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
    })

    it('Should be able to fetch recent questions', async () => {
        await inMemoryAnswersRepository.create(makeAnswer({ 
            questionId: new UniqueEntityID('question-1') 
        }))
        await inMemoryAnswersRepository.create(makeAnswer({ 
            questionId: new UniqueEntityID('question-1') 
        }))
        await inMemoryAnswersRepository.create(makeAnswer({ 
            questionId: new UniqueEntityID('question-1') 
        }))

        const { answers } = await sut.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect (answers).toHaveLength(3)
    })

    it('Should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i ++) {
            await inMemoryAnswersRepository.create(makeAnswer({
                questionId: new UniqueEntityID('question-1'),
            }))
        }

        const { answers } = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(answers).toHaveLength(2)
    })
})
