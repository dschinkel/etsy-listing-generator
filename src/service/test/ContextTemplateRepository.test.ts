import * as fs from 'fs';
import * as path from 'path';
import { createContextTemplateRepository } from '../repositories/ContextTemplateRepository';

describe('Context Template Repository', () => {
  const dbPath = path.join(process.cwd(), 'src', 'db', 'context-templates.test.json');

  beforeEach(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  it('retrieves all templates from storage', async () => {
    const templates = [{ name: 'Test', text: 'Test context' }];
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(templates));

    const repository = createContextTemplateRepository(dbPath);
    const result = await repository.getAll();

    expect(result).toEqual(templates);
  });

  it('saves a new template to storage', async () => {
    const repository = createContextTemplateRepository(dbPath);
    const newTemplate = { name: 'New', text: 'New context' };
    
    await repository.save(newTemplate);
    
    const result = await repository.getAll();
    expect(result).toContainEqual(newTemplate);
  });
});
