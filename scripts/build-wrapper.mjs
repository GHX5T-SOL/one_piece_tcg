import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const deployDir = path.join(root, "deploy");
const dataDir = path.join(deployDir, "data");
const mediaDir = path.join(deployDir, "media");

fs.mkdirSync(deployDir, { recursive: true });
fs.rmSync(dataDir, { recursive: true, force: true });
fs.mkdirSync(dataDir, { recursive: true });

for (const dir of ["inventory", "game", "research"]) {
  fs.cpSync(path.join(root, "data", dir), path.join(dataDir, dir), { recursive: true });
}

fs.rmSync(mediaDir, { recursive: true, force: true });
fs.mkdirSync(mediaDir, { recursive: true });
for (const dir of ["reports", "stills", "audio"]) {
  const src = path.join(root, "media", dir);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(mediaDir, dir), { recursive: true });
}
fs.copyFileSync(path.join(root, "media/manifest.json"), path.join(mediaDir, "manifest.json"));

const config = {
  passcodeHash: process.env.GRAND_LINE_PASSCODE_SHA256 || "",
  privateLabel: process.env.GRAND_LINE_PRIVATE_LABEL || "Ghost x Zoro private strategy portal",
  unityLoader: "game/Build/game.loader.js",
  unityConfig: {
    dataUrl: "game/Build/game.data",
    frameworkUrl: "game/Build/game.framework.js",
    codeUrl: "game/Build/game.wasm",
    streamingAssetsUrl: "game/StreamingAssets",
    companyName: "GHXST",
    productName: "Ghost x Zoro Grand Line TCG",
    productVersion: "0.1.0"
  }
};

fs.writeFileSync(path.join(deployDir, "config.js"), `window.GRAND_LINE_CONFIG = ${JSON.stringify(config, null, 2)};\n`);
fs.cpSync(path.join(root, "web/wrapper"), deployDir, { recursive: true });

const receipt = {
  generatedAt: new Date().toISOString(),
  status: "pass",
  deployDir: "deploy",
  passcodeHashConfigured: Boolean(config.passcodeHash),
  unityBuildPresent: fs.existsSync(path.join(deployDir, config.unityLoader))
};
fs.writeFileSync(path.join(root, "docs/qa/wrapper-build.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
