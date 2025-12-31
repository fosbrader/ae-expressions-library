import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import matter from 'gray-matter';
import categories from '../src/data/categories.json' with { type: 'json' };
import projects from '../src/data/projects.json' with { type: 'json' };

const expressionTypeIds = new Set(categories.expressionTypes.map((type) => type.id));
const layerTypeIds = new Set(categories.layerTypes.map((type) => type.id));
const propertyTypeIds = new Set(categories.propertyTypes.map((type) => type.id));
const complexityLevels = new Set(categories.complexityLevels.map((level) => level.id));
const projectIds = new Set(projects.projects.map((project) => project.id));

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const annotationLinesPattern = /^\d+(?:-\d+)?$/;

function assertUniqueIds(items) {
  const ids = items.map((item) => item.id);
  const uniqueIds = new Set(ids);
  assert.strictEqual(uniqueIds.size, ids.length, 'IDs must be unique');
  assert.ok(uniqueIds.size > 0, 'ID collection must not be empty');
  uniqueIds.forEach((id) => assert.ok(id, 'ID must be truthy'));
}

describe('Category data integrity', () => {
  it('expression types have unique, labeled entries', () => {
    assertUniqueIds(categories.expressionTypes);
    categories.expressionTypes.forEach((type) => {
      assert.ok(type.label, 'expression type label must be present');
      assert.ok(type.icon, 'expression type icon must be present');
      assert.ok(type.description, 'expression type description must be present');
    });
  });

  it('layer types and property types are unique and labeled', () => {
    assertUniqueIds(categories.layerTypes);
    categories.layerTypes.forEach((type) => {
      assert.ok(type.label, 'layer type label must be present');
      assert.ok(type.icon, 'layer type icon must be present');
    });

    assertUniqueIds(categories.propertyTypes);
    categories.propertyTypes.forEach((type) => {
      assert.ok(type.label, 'property type label must be present');
    });
  });

  it('complexity levels are defined across the expected range', () => {
    assert.ok(complexityLevels.size >= 4, 'should include four complexity levels');
    categories.complexityLevels.forEach((level) => {
      assert.ok(level.label, 'complexity label must be present');
      assert.ok(level.icon, 'complexity icon must be present');
      assert.ok(/^#/.test(level.color), 'complexity color must be a hex value');
      assert.ok(level.blocks >= 1, 'complexity blocks should be at least 1');
      assert.ok(level.description, 'complexity description must be present');
      assert.ok(level.id >= 1 && level.id <= 4, 'complexity id must be between 1-4');
    });
  });
});

describe('Project data integrity', () => {
  it('projects have unique ids and required metadata', () => {
    assertUniqueIds(projects.projects);
    projects.projects.forEach((project) => {
      assert.ok(project.name, 'project name must be present');
      assert.ok(project.client, 'project client must be present');
      assert.ok(project.year >= 2000 && project.year < 2100, 'project year should be reasonable');
      assert.ok(project.description, 'project description must be present');
    });
  });
});

describe('Expression frontmatter validation', () => {
  const expressionsDir = path.resolve(process.cwd(), 'src', 'content', 'expressions');
  const files = fs.readdirSync(expressionsDir).filter((file) => file.endsWith('.mdx'));

  it('has at least one expression to validate', () => {
    assert.ok(files.length > 0, 'expression directory should not be empty');
  });

  files.forEach((fileName) => {
    it(`${fileName} has valid metadata`, () => {
      const filePath = path.join(expressionsDir, fileName);
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

      assert.equal(typeof data.title, 'string');
      assert.ok(data.title.trim().length > 0, 'title must not be empty');
      assert.equal(typeof data.description, 'string');
      assert.ok(data.description.trim().length > 0, 'description must not be empty');
      assert.ok(data.aeVersion, 'aeVersion must be present');
      assert.equal(typeof data.code, 'string');
      assert.ok(data.code.trim().length > 0, 'code must not be empty');

      assert.ok(datePattern.test(data.dateAdded), 'dateAdded must match YYYY-MM-DD');
      if (data.lastUpdated) {
        assert.ok(datePattern.test(data.lastUpdated), 'lastUpdated must match YYYY-MM-DD when present');
      }

      assert.ok(Array.isArray(data.expressionTypes) && data.expressionTypes.length > 0, 'expressionTypes must be a non-empty array');
      data.expressionTypes.forEach((type) => {
        assert.ok(expressionTypeIds.has(type), `expression type ${type} must exist in category data`);
      });

      assert.equal(typeof data.layerType, 'string');
      assert.ok(layerTypeIds.has(data.layerType), `layerType ${data.layerType} must exist in category data`);

      assert.equal(typeof data.propertyType, 'string');
      assert.ok(propertyTypeIds.has(data.propertyType), `propertyType ${data.propertyType} must exist in category data`);

      assert.equal(typeof data.complexity, 'number');
      assert.ok(complexityLevels.has(data.complexity), 'complexity must map to a defined level');

      assert.ok(Array.isArray(data.projects), 'projects must be an array');
      data.projects.forEach((projectId) => {
        assert.ok(projectIds.has(projectId), `project ${projectId} must exist in project data`);
      });

      assert.ok(Array.isArray(data.annotations) && data.annotations.length > 0, 'annotations must be a non-empty array');
      data.annotations.forEach((annotation) => {
        assert.equal(typeof annotation.title, 'string');
        assert.ok(annotation.title.trim().length > 0, 'annotation title must not be empty');
        assert.equal(typeof annotation.description, 'string');
        assert.ok(annotation.description.trim().length > 0, 'annotation description must not be empty');
        assert.equal(typeof annotation.lines, 'string');
        assert.ok(annotationLinesPattern.test(annotation.lines), 'annotation lines must use number or range syntax');
      });
    });
  });
});
