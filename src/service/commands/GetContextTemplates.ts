import { ContextTemplate } from '../repositories/ContextTemplateRepository';

export const createGetContextTemplates = (repository: any) => {
  const execute = async (): Promise<ContextTemplate[]> => {
    return await repository.getAll();
  };

  return { execute };
};
