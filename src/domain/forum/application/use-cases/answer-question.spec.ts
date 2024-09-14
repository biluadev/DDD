import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answers-repository"
import { AnswerQuestionUseCase } from "./answer-questions"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswerAttachmentRepository } from "@/test/repositories/in-memory-answer-attachment-repository"

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository
    )

    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('Should be able to create a answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2']
    })

    expect(result.isRight).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1')}),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2')}),
      
    ])
  })
})
