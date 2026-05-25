import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const excludedDirs = new Set([".git", "node_modules", "Library", "Temp", "Obj", "Logs", "dist"]);
const excludedPathFragments = ["/deploy/game/"];
const excludedFiles = new Set(["docs/qa/pii-scan.json"]);
const allowedExtensions = new Set([".md", ".json", ".js", ".mjs", ".ts", ".tsx", ".css", ".html", ".toml", ".yaml", ".yml", ".example", ".txt", ".cs"]);
const patterns = [
  { name: "email", regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
  { name: "wallet-like-hex", regex: /\b0x[a-fA-F0-9]{40}\b/g },
  { name: "tracking-like", regex: /\b(1Z[A-Z0-9]{16}|[A-Z]{2}\d{9}[A-Z]{2})\b/g },
  { name: "phone-like", regex: /(?<!\d)(?:\+\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}(?!\d)/g }
];

const allowlist = [
  "GRAND_LINE_PASSCODE_SHA256",
  "https://",
  "http://"
];

const findings = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excludedDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs);
      continue;
    }
    const ext = path.extname(entry.name) || (entry.name.includes(".") ? "" : `.${entry.name}`);
    const relative = `/${path.relative(root, abs)}`;
    if (excludedFiles.has(relative.slice(1))) continue;
    if (excludedPathFragments.some((fragment) => relative.includes(fragment))) continue;
    if (!allowedExtensions.has(ext) && !entry.name.endsWith(".example")) continue;
    const text = fs.readFileSync(abs, "utf8");
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern.regex)) {
        const value = match[0];
        if (allowlist.some((allowed) => value.includes(allowed))) continue;
        const line = text.slice(0, match.index).split(/\r?\n/).length;
        findings.push({ file: path.relative(root, abs), line, pattern: pattern.name, value });
      }
    }
  }
};

walk(root);

const receipt = {
  generatedAt: new Date().toISOString(),
  status: findings.length === 0 ? "pass" : "review",
  findingCount: findings.length,
  findings
};

fs.mkdirSync(path.join(root, "docs/qa"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/qa/pii-scan.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));

if (findings.length > 0) process.exitCode = 1;
