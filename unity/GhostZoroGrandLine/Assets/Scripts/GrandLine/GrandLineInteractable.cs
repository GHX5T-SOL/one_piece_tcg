using UnityEngine;

namespace GhostZoro.GrandLine
{
    public sealed class GrandLineInteractable : MonoBehaviour
    {
        [TextArea(2, 6)]
        public string title;

        [TextArea(4, 12)]
        public string body;

        public string actionLabel = "E";
        public bool facePlayer = true;
    }
}
