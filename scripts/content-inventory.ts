import path from 'node:path';
import { formatContentInventoryReport, scanContentInventory } from '../src/lib/contentInventory';

const contentRoot = path.join(process.cwd(), 'src', 'content');
const inventory = scanContentInventory(contentRoot);

// eslint-disable-next-line no-console
console.log(process.argv.includes('--json')
  ? JSON.stringify(inventory, null, 2)
  : formatContentInventoryReport(inventory));

if (inventory.summary.issues.error > 0) {
  process.exitCode = 1;
}
