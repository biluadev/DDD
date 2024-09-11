import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
    })

    it('Should be able to delete a comment on question', async () => {
        const questionComment = makeQuestionComment();

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        });

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
    });

    it('Should not be able to delete another user question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1'),
        }
        );

        await inMemoryQuestionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    });

})
