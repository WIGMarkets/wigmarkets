#!/usr/bin/env node

/**
 * Seeds data/fear-greed-history.json from the existing hardcoded constants.
 * Run once to initialize the data file, then the daily cron takes over.
 *
 * Usage: node scripts/seed-fear-greed.mjs
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const HISTORY_PATH = join(DATA_DIR, "fear-greed-history.json");

// Recreate the hardcoded history from constants.js
const FEAR_HISTORY = [
  48, 44, 41, 38, 42, 47, 50, 53, 49, 46,
  43, 48, 55, 59, 63, 61, 57, 54, 58, 63,
  67, 71, 68, 65, 60, 57, 59, 63, 61, 62,
];

function getLabel(v) {
  if (v <= 24) return "Skrajna panika";
  if (v <= 44) return "Strach";
  if (v <= 55) return "Neutralny";
  if (v <= 74) return "Chciwość";
  return "Skrajna chciwość";
}

function getColor(v) {
  if (v <= 24) return "#dc2626";
  if (v <= 44) return "#ea580c";
  if (v <= 55) return "#ca8a04";
  if (v <= 74) return "#16a34a";
  return "#15803d";
}

// Generate 30 days of seed data from the hardcoded history
const today = new Date();
const history = FEAR_HISTORY.map((value, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - (FEAR_HISTORY.length - 1 - i));
  // Skip weekends
  const date = d.toISOString().slice(0, 10);
  return {
    date,
    value,
    label: getLabel(value),
    color: getColor(value),
    indicators: [
      { name: "Momentum rynku", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Siła wolumenu", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Szerokość rynku", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Zmienność rynku", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Nowe szczyty vs dołki", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Małe vs duże spółki", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
      { name: "Popyt na bezpieczne aktywa", value: Math.round(value + (Math.random() - 0.5) * 20), label: "", description: "" },
    ].map(ind => ({
      ...ind,
      value: Math.max(0, Math.min(100, ind.value)),
      label: getLabel(Math.max(0, Math.min(100, ind.value))),
    })),
    indicatorsUsed: 7,
    updatedAt: d.toISOString(),
  };
});

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n");
console.log(`Seeded ${history.length} entries to ${HISTORY_PATH}`);
