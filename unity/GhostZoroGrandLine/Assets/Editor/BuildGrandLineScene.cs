using GhostZoro.GrandLine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace GhostZoro.Editor
{
    public static class BuildGrandLineScene
    {
        public static void Build()
        {
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "GrandLineHub";

            GameObject bootstrap = new("Grand Line Runtime");
            bootstrap.AddComponent<GrandLineRuntime>();

            EditorSceneManager.SaveScene(scene, "Assets/Scenes/GrandLineHub.unity");
            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene("Assets/Scenes/GrandLineHub.unity", true)
            };

            PlayerSettings.companyName = "GHXST";
            PlayerSettings.productName = "Ghost x Zoro Grand Line TCG";
            PlayerSettings.stripEngineCode = false;
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            PlayerSettings.WebGL.dataCaching = false;
            PlayerSettings.WebGL.template = "APPLICATION:Default";
            AssetDatabase.SaveAssets();
            Debug.Log("Ghost x Zoro Grand Line scene generated.");
        }
    }
}
