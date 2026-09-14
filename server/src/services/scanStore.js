import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(directory, '../../data/scans.json');

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeAll(scans) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(scans, null, 2));
}

export async function findScans() {
  return (await readAll()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function findScan(id) {
  return (await readAll()).find((scan) => scan.id === id) || null;
}

export async function saveScan(scan) {
  const scans = await readAll();
  scans.push(scan);
  await writeAll(scans.slice(-100));
  return scan;
}

export async function removeScan(id) {
  const scans = await readAll();
  const next = scans.filter((scan) => scan.id !== id);
  if (next.length === scans.length) return false;
  await writeAll(next);
  return true;
}
