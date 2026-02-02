import * as fs from 'fs';
import * as path from 'path';

export interface EditPromptVersion {
  version: string;
  template: string;
  lineTemplate: string;
}

export const createEditPromptRepository = (dbPath: string) => {
  const getAll = async (): Promise<EditPromptVersion[]> => {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    try {
      const parsed = JSON.parse(data);
      return parsed.versions || [];
    } catch (e) {
      console.error('Error parsing edit prompt versions:', e);
      return [];
    }
  };

  const save = async (version: EditPromptVersion): Promise<void> => {
    const versions = await getAll();
    const index = versions.findIndex(v => v.version === version.version);
    if (index !== -1) {
      versions[index] = version;
    } else {
      versions.push(version);
    }
    
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(dbPath, JSON.stringify({ versions }, null, 2));
  };

  const remove = async (versionName: string): Promise<void> => {
    const versions = await getAll();
    const filtered = versions.filter(v => v.version !== versionName);
    fs.writeFileSync(dbPath, JSON.stringify({ versions: filtered }, null, 2));
  };

  return { getAll, save, remove };
};
