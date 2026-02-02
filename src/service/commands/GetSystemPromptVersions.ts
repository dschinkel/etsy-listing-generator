export const createGetSystemPromptVersions = (repository: any) => {
  const execute = async () => {
    return await repository.getAll();
  };

  return { execute };
};
