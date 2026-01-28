import * as fs from 'fs';
import * as path from 'path';

export interface ContextTemplate {
  name: string;
  text: string;
}

export const createContextTemplateRepository = (dbPath: string) => {
  const getAll = async (): Promise<ContextTemplate[]> => {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing context templates:', e);
      return [];
    }
  };

  const save = async (template: ContextTemplate): Promise<void> => {
    const templates = await getAll();
    templates.push(template);
    
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(templates, null, 2));
  };

  const remove = async (name: string): Promise<void> => {
    const templates = await getAll();
    const filtered = templates.filter(t => t.name !== name);
    fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2));
  };

  return { getAll, save, remove };
};
