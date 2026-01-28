import { ContextTemplate } from '../repositories/ContextTemplateRepository';

export const createSaveContextTemplate = (repository: any) => {
  const execute = async (template: ContextTemplate): Promise<void> => {
    return await repository.save(template);
  };

  return { execute };
};
