# Architecture

## Runtime

- Unity Editor: `6000.4.5f1`.
- Target: WebGL static build.
- Deploy shell: static `deploy/` wrapper with password gate before Unity loads.
- Data: seeded JSON in `data/` copied to Unity StreamingAssets and deploy assets.
- Persistence: browser local storage / IndexedDB from wrapper bridge, with JSON import/export.

## Unity Project

Path: `unity/GhostZoroGrandLine/`

Expected scene:

- `Assets/Scenes/GrandLineHub.unity`
- `Assets/Scripts/GrandLine/`
- `Assets/StreamingAssets/data/`
- `Assets/StreamingAssets/media/`

Batch commands:

```bash
/Applications/Unity/Hub/Editor/6000.4.5f1/Unity.app/Contents/MacOS/Unity -batchmode -quit -createProject unity/GhostZoroGrandLine
/Applications/Unity/Hub/Editor/6000.4.5f1/Unity.app/Contents/MacOS/Unity -batchmode -quit -projectPath unity/GhostZoroGrandLine -executeMethod GhostZoro.Editor.BuildGrandLineScene.Build
/Applications/Unity/Hub/Editor/6000.4.5f1/Unity.app/Contents/MacOS/Unity -batchmode -quit -projectPath unity/GhostZoroGrandLine -executeMethod GhostZoro.Editor.WebGLBuild.Build
```

## Password Gate

No passcode is committed. Deployment should provide a hashed passcode through environment variables. Local development uses `.env.local`, ignored by git.

## Fallback Rule

If the Unity WebGL module is missing or the build fails, keep `deploy/` as a static password-gated wrapper with a clear blocker in QA, but do not represent it as final Unity WebGL.
