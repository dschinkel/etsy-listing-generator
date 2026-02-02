import * as fs from 'fs';

export interface SystemPromptVersion {
  version: string;
  date: string;
  template: string;
}

export const createSystemPromptRepository = (dbPath: string) => {
  const getAll = async (): Promise<SystemPromptVersion[]> => {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    try {
      const parsed = JSON.parse(data);
      return parsed.versions || [];
    } catch (e) {
      console.error('Error parsing system prompt versions:', e);
      return [];
    }
  };

  return { getAll };
};
