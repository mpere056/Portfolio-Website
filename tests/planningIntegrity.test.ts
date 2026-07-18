import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const plans = path.join(root, 'documentation', 'implementation-plans');
const work = path.join(root, 'documentation', 'implementation-work');
const evidence = path.join(root, 'documentation', 'implementation-evidence');

const packagePattern = /(?:BAS|ARC|KG|EXP|AI|LPS|ART|PRJ|ABT|QA|PXP)-\d+/g;
const evidencePattern = /EV-[A-Z0-9]+-\d+-\d+/g;

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function section(markdown: string, heading: string) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) throw new Error(`Missing section: ${heading}`);
  const next = markdown.indexOf('\n## ', start + heading.length + 3);
  return markdown.slice(start, next === -1 ? undefined : next);
}

function cells(line: string) {
  return line.split('|').slice(1, -1).map(cell => cell.trim().replaceAll('`', ''));
}

function field(markdown: string, name: string) {
  const match = markdown.match(new RegExp(`^\\| ${name} \\| (.+?) \\|$`, 'm'));
  return match?.[1].replaceAll('`', '').trim();
}

function tableRows(markdown: string) {
  return markdown.split(/\r?\n/).filter(line => line.startsWith('| ') && !line.startsWith('| ---'));
}

describe('implementation planning integrity', () => {
  const packageDocument = read('documentation/implementation-plans/13-Execution-Work-Packages.md');
  const packageRows = tableRows(packageDocument)
    .map(cells)
    .filter(row => /^(?:BAS|ARC|KG|EXP|AI|LPS|ART|PRJ|ABT|QA|PXP)-\d+$/.test(row[0]));
  const packages = new Map(packageRows.map(row => [row[0], row.at(-1)!]));

  it('keeps package IDs unique and every package dependency resolvable', () => {
    expect(packages.size).toBe(packageRows.length);
    expect(packages.size).toBeGreaterThan(0);

    for (const row of packageRows) {
      const dependencies = row[2].match(packagePattern) ?? [];
      for (const dependency of dependencies) {
        expect(packages.has(dependency), `${row[0]} references unknown package ${dependency}`).toBe(true);
      }
    }
  });

  it('matches dashboard package counts to canonical package rows', () => {
    const dashboard = read('documentation/implementation-plans/16-Progress-Dashboard.md');
    const snapshot = section(dashboard, 'Package Snapshot');
    const dashboardCounts = new Map(
      tableRows(snapshot)
        .map(cells)
        .filter(row => /^\d+$/.test(row[1]))
        .map(row => [row[0], Number(row[1])]),
    );
    const actualCounts = new Map<string, number>();
    for (const status of packages.values()) {
      actualCounts.set(status, (actualCounts.get(status) ?? 0) + 1);
    }

    for (const [status, count] of actualCounts) {
      expect(dashboardCounts.get(status), `dashboard is missing package state ${status}`).toBe(count);
    }
    for (const [status, count] of dashboardCounts) {
      expect(count, `dashboard count for ${status} does not match package rows`).toBe(actualCounts.get(status) ?? 0);
    }
  });

  it('keeps active work files and the work registry one-to-one', () => {
    const registry = read('documentation/implementation-work/README.md');
    const activeRows = tableRows(section(registry, 'Active And Unfinished Items'))
      .map(cells)
      .filter(row => /^WI-/.test(row[0]));
    const registryItems = new Map(activeRows.map(row => [row[0], { state: row[2], packageId: row[4] }]));
    const activeFiles = fs.readdirSync(path.join(work, 'active'))
      .filter(file => /^WI-.*\.md$/.test(file));
    const currentFocus = tableRows(section(registry, 'Current Focus'))
      .map(cells)
      .find(row => row[0] === 'Now');

    expect([...registryItems.keys()].sort()).toEqual(activeFiles.map(file => file.slice(0, -3)).sort());
    expect(activeRows.filter(row => row[2] === 'in-progress').length).toBeLessThanOrEqual(1);
    expect(currentFocus, 'work registry has no Now row').toBeDefined();
    expect(registryItems.get(currentFocus![1])).toEqual({ state: currentFocus![2], packageId: currentFocus![3] });

    for (const file of activeFiles) {
      const markdown = fs.readFileSync(path.join(work, 'active', file), 'utf8');
      const id = file.slice(0, -3);
      const item = registryItems.get(id);
      expect(item, `${id} is absent from the active registry`).toBeDefined();
      expect(field(markdown, 'State')).toBe(item?.state);
      expect(field(markdown, 'Package')).toBe(item?.packageId);
      expect(packages.has(item!.packageId), `${id} references unknown package ${item!.packageId}`).toBe(true);
      expect(field(markdown, 'Last update'), `${id} has no resumable update date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps every capability package reference canonical', () => {
    const ledger = read('documentation/implementation-plans/15-Capability-Coverage-Ledger.md');
    const capabilityRows = tableRows(ledger)
      .map(cells)
      .filter(row => /^CAP-/.test(row[0]));

    expect(capabilityRows.length).toBeGreaterThan(0);
    for (const row of capabilityRows) {
      const references = row[2].match(packagePattern) ?? [];
      expect(references.length, `${row[0]} has no package reference`).toBeGreaterThan(0);
      for (const packageId of references) {
        expect(packages.has(packageId), `${row[0]} references unknown package ${packageId}`).toBe(true);
      }
    }
  });

  it('registers every durable evidence item exactly once in an existing file', () => {
    const evidenceIndex = read('documentation/implementation-evidence/README.md');
    const registryRows = tableRows(section(evidenceIndex, 'Registry'))
      .map(cells)
      .filter(row => /^EV-/.test(row[0]));
    const registered = new Map(registryRows.map(row => [row[0], row]));
    expect(registered.size).toBe(registryRows.length);

    const durableIds = fs.readdirSync(evidence)
      .filter(file => file.endsWith('.md') && !['README.md', '_Package-Evidence-Template.md'].includes(file))
      .flatMap(file => {
        const markdown = fs.readFileSync(path.join(evidence, file), 'utf8');
        const packageId = file.slice(0, -3);
        const ids = new Set(markdown.match(new RegExp(`EV-${packageId}-\\d+`, 'g')) ?? []);
        return [...ids].map(id => ({ id, file }));
      });

    expect(new Set(durableIds.map(item => item.id)).size).toBe(durableIds.length);
    for (const item of durableIds) {
      expect(registered.has(item.id), `${item.id} in ${item.file} is missing from the evidence registry`).toBe(true);
      expect(registered.get(item.id)?.at(-1)).toBe(item.file);
    }
    for (const [id, row] of registered) {
      const file = row.at(-1)!;
      expect(fs.existsSync(path.join(evidence, file)), `${id} points to missing ${file}`).toBe(true);
      expect(durableIds.some(item => item.id === id && item.file === file), `${id} has no durable heading in ${file}`).toBe(true);
    }
  });

  it('resolves capability evidence references and dashboard evidence totals', () => {
    const ledger = read('documentation/implementation-plans/15-Capability-Coverage-Ledger.md')
      .split('## Per-Capability Detail Record')[0];
    const evidenceIndex = read('documentation/implementation-evidence/README.md');
    const registryRows = tableRows(section(evidenceIndex, 'Registry'))
      .map(cells)
      .filter(row => /^EV-/.test(row[0]));
    const registered = new Set(registryRows.map(row => row[0]));

    for (const id of new Set(ledger.match(evidencePattern) ?? [])) {
      expect(registered.has(id), `${id} is referenced by the capability ledger but unregistered`).toBe(true);
    }

    const actualCounts = new Map<string, number>();
    for (const row of registryRows) actualCounts.set(row[4], (actualCounts.get(row[4]) ?? 0) + 1);
    const dashboardRows = tableRows(section(read('documentation/implementation-plans/16-Progress-Dashboard.md'), 'Evidence Summary'))
      .map(cells)
      .filter(row => /^\d+$/.test(row[1]));

    for (const row of dashboardRows) {
      expect(Number(row[1]), `dashboard evidence count for ${row[0]} is stale`).toBe(actualCounts.get(row[0].toLowerCase()) ?? 0);
    }
    for (const [status, count] of actualCounts) {
      const dashboard = dashboardRows.find(row => row[0].toLowerCase() === status);
      expect(dashboard, `dashboard is missing evidence status ${status}`).toBeDefined();
      expect(Number(dashboard![1])).toBe(count);
    }
  });
});
