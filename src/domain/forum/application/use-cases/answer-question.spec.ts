import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answers-repository"
import { AnswerQuestionUseCase } from "./answer-questions"

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('Should be able to create a answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Conteúdo da resposta'
    })

    expect(result.isRight).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
  })
})
