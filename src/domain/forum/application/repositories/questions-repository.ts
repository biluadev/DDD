import { PaginationParams } from '@/core/shareRepositories/pagination-params'
import { Question } from '../../enterprise/entities/questions'

export interface QuestionsRepository {
    findById(id: string): Promise<Question | null>
    findBySlug(slug: string): Promise<Question | null>
    findManyRecent(params: PaginationParams): Promise<Question[]>
    save(question: Question): Promise<void>
    create(question: Question): Promise<void>
    delete(question: Question): Promise<void>
}
