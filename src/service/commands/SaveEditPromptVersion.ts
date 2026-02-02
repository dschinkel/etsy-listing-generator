import { EditPromptVersion } from '../repositories/EditPromptRepository';

export const createSaveEditPromptVersion = (repository: any) => {
  const execute = async (version: EditPromptVersion): Promise<void> => {
    return await repository.save(version);
  };

  return { execute };
};
