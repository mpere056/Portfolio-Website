import { loadKnowledgeGraph } from '../src/lib/content/graph';

async function main() {
  const graph = await loadKnowledgeGraph();
  if (graph.issues.length > 0) {
    const details = graph.issues
      .map(issue => `${issue.code} [${issue.subjectId}]: ${issue.message}`)
      .join('\n');
    throw new Error(`Content validation failed:\n${details}`);
  }

  process.stdout.write(
    `Content validation passed (${graph.nodes.length} nodes, ${graph.relationships.length} relationships).\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
