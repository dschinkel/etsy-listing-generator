import * as request from 'supertest';
import app from '../../app';

const supertest = (request as any).default || request;

describe('Prompt Preview Integration', () => {
  it('gets system prompt', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ lifestyleCount: 1 });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toBeDefined();
    expect(response.body.systemPrompt).toContain('lifestyle');
  });

  it('gets default prompt for empty request', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('hero');
  });

  it('gets default prompt for missing body', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt');

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('hero');
  });

  it('gets prompt for editSpecifications', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ editSpecifications: [{ field: 'Name', value: 'Alice' }] });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('EDIT MODE — TEXT REPLACEMENT ONLY');
    expect(response.body.systemPrompt).toContain('Replace the NAME text with: Alice');
    expect(response.body.systemPrompt).not.toContain('Replace the NUMBER text with:');
  });

  it('gets prompt with multiple editSpecifications', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ 
        editSpecifications: [
          { field: 'Name', value: 'Alice' },
          { field: 'Number', value: '42' },
          { field: 'Background', value: 'Red' }
        ] 
      });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('Replace the NAME text with: Alice');
    expect(response.body.systemPrompt).toContain('Replace the NUMBER text with: 42');
    expect(response.body.systemPrompt).toContain('Replace the BACKGROUND COLOR text with: Red');
  });

  it('gets prompt for editSpecifications with editCount', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ 
        editSpecifications: [{ field: 'Name', value: 'Alice' }],
        editCount: 3
      });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('Generate 3 image(s)');
  });

  it('gets prompt for editSpecifications with v2 template', async () => {
    const v2Template = "EDIT MODE — LITERAL TEXT REPLACEMENT ONLY\n{{ALLOWED_CHANGES}}";
    const v2LineTemplate = "• Replace the {{FIELD}} text with the literal string: \"{{VALUE}}\"";
    
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ 
        editSpecifications: [{ field: 'Name', value: 'OWEN' }],
        editPromptTemplate: v2Template,
        editPromptLineTemplate: v2LineTemplate
      });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('EDIT MODE — LITERAL TEXT REPLACEMENT ONLY');
    expect(response.body.systemPrompt).toContain('• Replace the NAME text with the literal string: "OWEN"');
  });

  it('gets prompt for editSpecifications with v2 template and editCount', async () => {
    const v2Template = "EDIT MODE — LITERAL TEXT REPLACEMENT ONLY\nGenerate {{IMAGE_COUNT}} images\n{{ALLOWED_CHANGES}}";
    
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ 
        editSpecifications: [{ field: 'Name', value: 'OWEN' }],
        editCount: 5,
        editPromptTemplate: v2Template
      });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('Generate 5 images');
  });

  it('gets edit prompt versions', async () => {
    const response = await supertest(app.callback())
      .get('/listings/edit-prompt-versions');

    expect(response.status).toBe(200);
    expect(response.body.versions).toBeDefined();
    expect(response.body.versions.length).toBeGreaterThan(0);
    expect(response.body.versions[0].version).toBe('edit image prompt v1');
    expect(response.body.versions[1].version).toBe('edit image prompt v2');
  });

  it('saves and removes an edit prompt version', async () => {
    const newVersion = {
      version: 'test v3',
      template: 'test template {{ALLOWED_CHANGES}}',
      lineTemplate: '• {{FIELD}}: {{VALUE}}'
    };

    // Save
    const saveResponse = await supertest(app.callback())
      .post('/listings/edit-prompt-versions')
      .send(newVersion);

    expect(saveResponse.status).toBe(201);
    expect(saveResponse.body.version).toMatchObject(newVersion);

    // Verify it exists
    const listResponse = await supertest(app.callback())
      .get('/listings/edit-prompt-versions');
    
    expect(listResponse.body.versions.some((v: any) => v.version === 'test v3')).toBe(true);

    // Remove
    const removeResponse = await supertest(app.callback())
      .delete('/listings/edit-prompt-versions/test%20v3');

    expect(removeResponse.status).toBe(200);

    // Verify it's gone
    const finalResponse = await supertest(app.callback())
      .get('/listings/edit-prompt-versions');
    
    expect(finalResponse.body.versions.some((v: any) => v.version === 'test v3')).toBe(false);
  });

  it('fails for GET request', async () => {
    const response = await supertest(app.callback())
      .get('/listings/system-prompt');

    expect(response.status).toBe(405);
    expect(response.body.error).toContain('Use POST instead');
  });
});
