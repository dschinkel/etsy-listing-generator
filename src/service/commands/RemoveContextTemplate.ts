export const createRemoveContextTemplate = (repository: any) => {
  const execute = async (name: string): Promise<void> => {
    return await repository.remove(name);
  };

  return { execute };
};
