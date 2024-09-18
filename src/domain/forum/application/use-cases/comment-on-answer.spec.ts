import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswerRepository(
            inMemoryAnswerAttachmentsRepository
        )
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

        sut = new CommentOnAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerCommentsRepository
        )
    })

    it('Should be able to comment on answer', async () => {
        const answer = makeAnswer();

        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            questionId: answer.questionId.toString(),
            content: 'Comentário teste!'
        });

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
            'Comentário teste!'
        );
    });

})
