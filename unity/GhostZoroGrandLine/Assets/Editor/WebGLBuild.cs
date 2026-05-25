using System.IO;
using UnityEditor;
using UnityEngine;

namespace GhostZoro.Editor
{
    public static class WebGLBuild
    {
        public static void Build()
        {
            string output = Path.GetFullPath(Path.Combine(Application.dataPath, "../../../deploy/game"));
            Directory.CreateDirectory(output);
            PlayerSettings.stripEngineCode = false;
            PlayerSettings.WebGL.template = "APPLICATION:Default";
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            PlayerSettings.WebGL.dataCaching = false;

            var options = new BuildPlayerOptions
            {
                scenes = new[] { "Assets/Scenes/GrandLineHub.unity" },
                locationPathName = output,
                target = BuildTarget.WebGL,
                options = BuildOptions.None
            };

            BuildPipeline.BuildPlayer(options);
        }
    }
}
