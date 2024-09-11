import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('Should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova Pergunta',
      content: 'Conteúdo da pergunta'
    })

    expect(result.isRight).toBe(true)
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
  })
})
