import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async saveLog (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
