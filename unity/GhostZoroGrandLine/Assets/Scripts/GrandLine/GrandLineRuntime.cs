using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Networking;
using UnityEngine.UI;

namespace GhostZoro.GrandLine
{
    public sealed class GrandLineRuntime : MonoBehaviour
    {
        private readonly List<GrandLineInteractable> interactables = new();
        private readonly List<Transform> bobbing = new();

        private CardDatabase cardDatabase;
        private OfferDatabase offerDatabase;
        private ValuationDatabase valuationDatabase;
        private DialogueDatabase dialogueDatabase;
        private SourceDatabase sourceDatabase;

        private Transform player;
        private Transform cameraRig;
        private Camera mainCamera;
        private Canvas canvas;
        private Font uiFont;
        private GameObject titlePanel;
        private GameObject dialoguePanel;
        private Text dialogueTitle;
        private Text dialogueBody;
        private Text promptText;
        private Text hudText;
        private float yaw;
        private bool playing;
        private string selectedCaptain = "Luffy";

        private readonly Color ink = new(0.027f, 0.063f, 0.078f, 1f);
        private readonly Color night = new(0.043f, 0.09f, 0.125f, 1f);
        private readonly Color deepSea = new(0.059f, 0.192f, 0.251f, 1f);
        private readonly Color teal = new(0.071f, 0.78f, 0.72f, 1f);
        private readonly Color gold = new(0.949f, 0.757f, 0.306f, 1f);
        private readonly Color red = new(0.898f, 0.294f, 0.294f, 1f);
        private readonly Color paper = new(0.953f, 0.937f, 0.886f, 1f);
        private readonly Color silver = new(0.737f, 0.784f, 0.82f, 1f);

        private IEnumerator Start()
        {
            Application.targetFrameRate = 60;
            uiFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            if (uiFont == null)
            {
                uiFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
            }

            yield return LoadAllData();
            BuildWorld();
            BuildUi();
            ShowTitle();
        }

        private void Update()
        {
            if (!playing || player == null)
            {
                AnimateIdle();
                return;
            }

            MovePlayer();
            UpdateCamera();
            UpdateInteractions();
            AnimateIdle();

            if (Input.GetKeyDown(KeyCode.Escape))
            {
                HideDialogue();
            }
        }

        private IEnumerator LoadAllData()
        {
            yield return LoadJson("data/inventory/cards.json", json => cardDatabase = JsonUtility.FromJson<CardDatabase>(json));
            yield return LoadJson("data/inventory/open-bids.json", json => offerDatabase = JsonUtility.FromJson<OfferDatabase>(json));
            yield return LoadJson("data/inventory/valuation.json", json => valuationDatabase = JsonUtility.FromJson<ValuationDatabase>(json));
            yield return LoadJson("data/game/dialogue.json", json => dialogueDatabase = JsonUtility.FromJson<DialogueDatabase>(json));
            yield return LoadJson("data/research/source-ledger.json", json => sourceDatabase = JsonUtility.FromJson<SourceDatabase>(json));
        }

        private IEnumerator LoadJson(string relativePath, Action<string> apply)
        {
            string url = $"{Application.streamingAssetsPath}/{relativePath}";
            using UnityWebRequest request = UnityWebRequest.Get(url);
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Failed to load {relativePath}: {request.error}");
                apply("{}");
                yield break;
            }

            apply(request.downloadHandler.text);
        }

        private void BuildWorld()
        {
            RenderSettings.skybox = null;
            RenderSettings.ambientLight = new Color(0.22f, 0.27f, 0.31f);
            CreateLight();
            CreateCamera();
            CreateOcean();
            CreateDeck();
            CreateLandmarks();
            CreateNpcs();
            CreateCardPedestals();
        }

        private void CreateLight()
        {
            var lightObject = new GameObject("Warm Deck Sun");
            var light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = new Color(1f, 0.86f, 0.62f);
            light.intensity = 1.35f;
            lightObject.transform.rotation = Quaternion.Euler(45f, -35f, 0f);
        }

        private void CreateCamera()
        {
            var cameraObject = new GameObject("Main Camera");
            mainCamera = cameraObject.AddComponent<Camera>();
            mainCamera.clearFlags = CameraClearFlags.SolidColor;
            mainCamera.backgroundColor = new Color(0.025f, 0.07f, 0.095f);
            mainCamera.fieldOfView = 54f;
            cameraObject.tag = "MainCamera";
            cameraRig = cameraObject.transform;
            cameraRig.position = new Vector3(0f, 8f, -16f);
            cameraRig.rotation = Quaternion.Euler(25f, 0f, 0f);
            var audio = cameraObject.AddComponent<AudioListener>();
            audio.enabled = true;
        }

        private void CreateOcean()
        {
            var ocean = GameObject.CreatePrimitive(PrimitiveType.Cube);
            ocean.name = "Animated Ocean Plane";
            ocean.transform.position = new Vector3(0f, -0.25f, 0f);
            ocean.transform.localScale = new Vector3(90f, 0.12f, 90f);
            ocean.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Ocean Deep Sea", deepSea, 0.25f);
        }

        private void CreateDeck()
        {
            var deck = GameObject.CreatePrimitive(PrimitiveType.Cube);
            deck.name = "Sunny Strategy Deck";
            deck.transform.position = new Vector3(0f, 0.05f, 0f);
            deck.transform.localScale = new Vector3(32f, 0.2f, 22f);
            deck.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Warm Wood Deck", new Color(0.34f, 0.2f, 0.09f), 0.12f);

            for (int i = -3; i <= 3; i++)
            {
                var rail = GameObject.CreatePrimitive(PrimitiveType.Cube);
                rail.name = "Gold Deck Rail";
                rail.transform.position = new Vector3(i * 4f, 1.1f, 11.1f);
                rail.transform.localScale = new Vector3(3.5f, 0.2f, 0.2f);
                rail.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Gold Rail", gold, 0.4f);
            }
        }

        private void CreateLandmarks()
        {
            CreateLandmark("Robin Archive", new Vector3(-12f, 0.8f, 6f), "Research source ledger, report PDF, OP14/EB04, and August 2026 release notes.");
            CreateLandmark("Usopp Bounty Board", new Vector3(12f, 0.8f, 6f), BuildBidSummary());
            CreateLandmark("Brook Theater", new Vector3(-12f, 0.8f, -6f), "Open the private dossier PDF/HTML, stills, narration, and collection soundtrack archive.");
            CreateLandmark("Sanji Market Route", new Vector3(12f, 0.8f, -6f), "Selling and buying routes: Courtyard, Phygitals, TCGplayer, Cardmarket, eBay/PSA Vault, Card Cache, TCGXchange, Wizards, and Collect-a-Con Cape Town.");
        }

        private void CreateLandmark(string title, Vector3 position, string body)
        {
            var marker = GameObject.CreatePrimitive(PrimitiveType.Cube);
            marker.name = title;
            marker.transform.position = position;
            marker.transform.localScale = new Vector3(3f, 1.6f, 0.35f);
            marker.GetComponent<Renderer>().sharedMaterial = MakeMaterial($"{title} Material", teal, 0.2f);
            AddLabel(title, marker.transform, new Vector3(0f, 1.4f, 0f), 0.23f);
            AddInteractable(marker, title, body);
        }

        private void CreateNpcs()
        {
            if (dialogueDatabase?.npcs == null) return;

            var positions = new[]
            {
                new Vector3(-8f, 1f, 2f),
                new Vector3(-5f, 1f, 5f),
                new Vector3(-2f, 1f, 7f),
                new Vector3(2f, 1f, 7f),
                new Vector3(5f, 1f, 5f),
                new Vector3(8f, 1f, 2f),
                new Vector3(0f, 1f, -7f)
            };

            var colors = new[] { gold, teal, new Color(0.16f, 0.58f, 0.95f), new Color(0.9f, 0.58f, 0.18f), red, new Color(0.9f, 0.5f, 0.65f), silver };

            for (int i = 0; i < dialogueDatabase.npcs.Length; i++)
            {
                NpcDialogue npc = dialogueDatabase.npcs[i];
                var body = GameObject.CreatePrimitive(PrimitiveType.Cube);
                body.name = $"NPC {npc.displayName}";
                body.transform.position = positions[i % positions.Length];
                body.transform.localScale = new Vector3(0.9f, 2.25f, 0.9f);
                body.GetComponent<Renderer>().sharedMaterial = MakeMaterial($"{npc.displayName} Material", colors[i % colors.Length], 0.15f);
                AddLabel(npc.displayName, body.transform, new Vector3(0f, 1.45f, 0f), 0.22f);
                bobbing.Add(body.transform);

                var text = new StringBuilder();
                text.AppendLine($"{npc.role} - {npc.topic}");
                text.AppendLine();
                text.AppendLine(npc.summary);
                text.AppendLine();
                foreach (string line in npc.dialogue ?? Array.Empty<string>())
                {
                    text.AppendLine($"- {line}");
                }

                AddInteractable(body, npc.displayName, text.ToString());
            }
        }

        private void CreateCardPedestals()
        {
            if (cardDatabase?.cards == null) return;

            for (int i = 0; i < cardDatabase.cards.Length; i++)
            {
                CardRecord card = cardDatabase.cards[i];
                float x = -10.5f + (i % 4) * 7f;
                float z = -1.5f - (i / 4) * 4f;

                var pedestal = GameObject.CreatePrimitive(PrimitiveType.Cube);
                pedestal.name = $"Pedestal {card.character}";
                pedestal.transform.position = new Vector3(x, 0.55f, z);
                pedestal.transform.localScale = new Vector3(2.8f, 0.8f, 1.7f);
                pedestal.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Pedestal Dark Metal", night, 0.55f);

                var slab = GameObject.CreatePrimitive(PrimitiveType.Cube);
                slab.name = $"Slab {card.cardNumber}";
                slab.transform.position = new Vector3(x, 2.1f, z);
                slab.transform.localScale = new Vector3(1.8f, 2.55f, 0.13f);
                slab.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
                slab.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Slab Silver", silver, 0.35f);

                var front = GameObject.CreatePrimitive(PrimitiveType.Cube);
                front.name = $"Card Art {card.cardNumber}";
                front.transform.SetParent(slab.transform);
                front.transform.localPosition = new Vector3(0f, -0.05f, -0.56f);
                front.transform.localRotation = Quaternion.identity;
                front.transform.localScale = new Vector3(0.68f, 0.92f, 0.05f);
                front.GetComponent<Renderer>().sharedMaterial = MakeCardMaterial(card);

                AddLabel($"{card.character}\n{card.gradeCompany} {card.grade}", slab.transform, new Vector3(0f, 1.55f, 0f), 0.16f);
                AddInteractable(slab, card.character, BuildCardBody(card));
            }
        }

        private Material MakeCardMaterial(CardRecord card)
        {
            string resourceName = Path.GetFileNameWithoutExtension(card.media?.officialArt ?? card.cardNumber);
            var texture = Resources.Load<Texture2D>($"Cards/{resourceName}");
            var material = MakeMaterial($"Card {resourceName}", paper, 0f);
            if (texture != null)
            {
                material.mainTexture = texture;
            }
            return material;
        }

        private string BuildCardBody(CardRecord card)
        {
            return $"{card.title}\n\n{card.gradeCompany} {card.grade} | Cert: {(string.IsNullOrEmpty(card.certNumber) ? "null" : card.certNumber)}\nStatus: {card.status}\nVisible value: ${card.visibleMarketValueUsd:0.00}\n\nAction: {card.action}\nConviction: {card.convictionScore} | Liquidity: {card.liquidityScore}\n\n{card.recommendation}\n\nRisk: {card.riskNotes}";
        }

        private string BuildBidSummary()
        {
            if (offerDatabase?.summary == null) return "Open bids loading.";
            return $"Open Courtyard exposure: ${offerDatabase.summary.totalExposureUsd:0.00}\nOffers: {offerDatabase.summary.openOffers}\nPSA: {offerDatabase.summary.psaOffers} | CGC: {offerDatabase.summary.cgcOffers}\n\nTop keep: Sabo PSA 10 at $19.00.\nFirst cancels: Shiki CGC 8 and duplicate Roger CGC 8.5.";
        }

        private void BuildUi()
        {
            var eventSystem = new GameObject("EventSystem");
            eventSystem.AddComponent<EventSystem>();
            eventSystem.AddComponent<StandaloneInputModule>();

            var canvasObject = new GameObject("HUD Canvas");
            canvas = canvasObject.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvasObject.GetComponent<CanvasScaler>().referenceResolution = new Vector2(1920f, 1080f);
            canvasObject.AddComponent<GraphicRaycaster>();

            hudText = CreateText("HUD", canvas.transform, "", 24, TextAnchor.UpperLeft, silver);
            SetRect(hudText.rectTransform, new Vector2(0f, 1f), new Vector2(0f, 1f), new Vector2(32f, -30f), new Vector2(720f, 120f));

            promptText = CreateText("Interact Prompt", canvas.transform, "", 28, TextAnchor.LowerCenter, gold);
            SetRect(promptText.rectTransform, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 70f), new Vector2(900f, 80f));

            BuildTitlePanel();
            BuildDialoguePanel();
        }

        private void BuildTitlePanel()
        {
            titlePanel = CreatePanel("Title Panel", canvas.transform, new Color(0.027f, 0.063f, 0.078f, 0.94f));
            SetRect(titlePanel.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);

            Text title = CreateText("Title", titlePanel.transform, "Ghost x Zoro\nGrand Line TCG", 80, TextAnchor.MiddleCenter, paper);
            SetRect(title.rectTransform, new Vector2(0.12f, 0.44f), new Vector2(0.88f, 0.82f), Vector2.zero, Vector2.zero);

            Text subtitle = CreateText("Subtitle", titlePanel.transform, "Choose your captain and enter the private card strategy hub.", 30, TextAnchor.MiddleCenter, silver);
            SetRect(subtitle.rectTransform, new Vector2(0.2f, 0.36f), new Vector2(0.8f, 0.44f), Vector2.zero, Vector2.zero);

            Button luffy = CreateButton("Choose Luffy", titlePanel.transform, "Luffy", new Vector2(-170f, -210f));
            luffy.onClick.AddListener(() => StartGame("Luffy"));

            Button zoro = CreateButton("Choose Zoro", titlePanel.transform, "Zoro", new Vector2(170f, -210f));
            zoro.onClick.AddListener(() => StartGame("Zoro"));
        }

        private void BuildDialoguePanel()
        {
            dialoguePanel = CreatePanel("Dialogue Panel", canvas.transform, new Color(0.027f, 0.063f, 0.078f, 0.92f));
            SetRect(dialoguePanel.GetComponent<RectTransform>(), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 210f), new Vector2(980f, 330f));

            dialogueTitle = CreateText("Dialogue Title", dialoguePanel.transform, "", 36, TextAnchor.UpperLeft, gold);
            SetRect(dialogueTitle.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(28f, -24f), new Vector2(-56f, 56f));

            dialogueBody = CreateText("Dialogue Body", dialoguePanel.transform, "", 22, TextAnchor.UpperLeft, paper);
            dialogueBody.horizontalOverflow = HorizontalWrapMode.Wrap;
            dialogueBody.verticalOverflow = VerticalWrapMode.Truncate;
            SetRect(dialogueBody.rectTransform, new Vector2(0f, 0f), new Vector2(1f, 1f), new Vector2(28f, 28f), new Vector2(-56f, -86f));

            Button close = CreateButton("Close Dialogue", dialoguePanel.transform, "Close", new Vector2(385f, -130f));
            close.onClick.AddListener(HideDialogue);

            dialoguePanel.SetActive(false);
        }

        private void ShowTitle()
        {
            titlePanel.SetActive(true);
            hudText.text = "";
            promptText.text = "";
        }

        private void StartGame(string captain)
        {
            selectedCaptain = captain;
            titlePanel.SetActive(false);
            playing = true;
            SpawnPlayer();
            hudText.text = $"Captain: {selectedCaptain}\nWASD/Arrows move | Mouse camera | E interact | Esc close\nVisible value ${valuationDatabase.summary.visibleCollectrValueUsd:0.00} | Open bids ${valuationDatabase.summary.openBidExposureUsd:0.00}";
        }

        private void SpawnPlayer()
        {
            var body = GameObject.CreatePrimitive(PrimitiveType.Cube);
            body.name = $"Player {selectedCaptain}";
            body.transform.position = new Vector3(0f, 1f, -2.5f);
            body.transform.localScale = new Vector3(0.95f, 2.05f, 0.95f);
            body.GetComponent<Renderer>().sharedMaterial = MakeMaterial($"{selectedCaptain} Material", selectedCaptain == "Zoro" ? teal : red, 0.15f);
            player = body.transform;
            AddLabel(selectedCaptain, player, new Vector3(0f, 1.5f, 0f), 0.22f);
        }

        private void MovePlayer()
        {
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");
            Vector3 forward = cameraRig.forward;
            forward.y = 0f;
            forward.Normalize();
            Vector3 right = cameraRig.right;
            right.y = 0f;
            right.Normalize();
            Vector3 move = (forward * vertical + right * horizontal);
            if (move.sqrMagnitude > 1f) move.Normalize();
            player.position += move * (5.2f * Time.deltaTime);
            player.position = new Vector3(Mathf.Clamp(player.position.x, -15f, 15f), 1f, Mathf.Clamp(player.position.z, -10f, 10f));
            if (move.sqrMagnitude > 0.001f)
            {
                player.rotation = Quaternion.Slerp(player.rotation, Quaternion.LookRotation(move), 12f * Time.deltaTime);
            }
        }

        private void UpdateCamera()
        {
            yaw += Input.GetAxis("Mouse X") * 2.2f;
            Quaternion rotation = Quaternion.Euler(24f, yaw, 0f);
            Vector3 desired = player.position + rotation * new Vector3(0f, 4.5f, -8.5f);
            cameraRig.position = Vector3.Lerp(cameraRig.position, desired, 10f * Time.deltaTime);
            cameraRig.LookAt(player.position + Vector3.up * 1.3f);
        }

        private void UpdateInteractions()
        {
            GrandLineInteractable nearest = null;
            float nearestDistance = 3.1f;

            foreach (GrandLineInteractable interactable in interactables)
            {
                if (interactable == null) continue;
                float distance = Vector3.Distance(player.position, interactable.transform.position);
                if (distance < nearestDistance)
                {
                    nearest = interactable;
                    nearestDistance = distance;
                }

                if (interactable.facePlayer)
                {
                    Vector3 look = player.position - interactable.transform.position;
                    look.y = 0f;
                    if (look.sqrMagnitude > 0.001f)
                    {
                        interactable.transform.rotation = Quaternion.Slerp(interactable.transform.rotation, Quaternion.LookRotation(look), 2f * Time.deltaTime);
                    }
                }
            }

            if (nearest == null)
            {
                promptText.text = "";
                return;
            }

            promptText.text = $"Press {nearest.actionLabel} to inspect {nearest.title}";
            if (Input.GetKeyDown(KeyCode.E))
            {
                ShowDialogue(nearest.title, nearest.body);
            }
        }

        private void AnimateIdle()
        {
            float t = Time.time;
            foreach (Transform target in bobbing)
            {
                if (target == null) continue;
                Vector3 position = target.position;
                position.y = 1f + Mathf.Sin(t * 2f + target.GetInstanceID()) * 0.05f;
                target.position = position;
            }
        }

        private void ShowDialogue(string title, string body)
        {
            dialogueTitle.text = title;
            dialogueBody.text = body;
            dialoguePanel.SetActive(true);
        }

        private void HideDialogue()
        {
            dialoguePanel?.SetActive(false);
        }

        private void AddInteractable(GameObject target, string title, string body)
        {
            GrandLineInteractable interactable = target.AddComponent<GrandLineInteractable>();
            interactable.title = title;
            interactable.body = body;
            interactables.Add(interactable);
        }

        private Material MakeMaterial(string name, Color color, float metallic)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null) shader = Shader.Find("Standard");
            if (shader == null) shader = Shader.Find("Unlit/Texture");
            if (shader == null) shader = Shader.Find("Unlit/Color");
            if (shader == null) shader = Shader.Find("Sprites/Default");

            var material = new Material(shader);
            material.name = name;
            material.color = color;
            if (material.HasProperty("_Metallic")) material.SetFloat("_Metallic", metallic);
            if (material.HasProperty("_Glossiness")) material.SetFloat("_Glossiness", 0.35f);
            if (material.HasProperty("_Smoothness")) material.SetFloat("_Smoothness", 0.35f);
            return material;
        }

        private void AddLabel(string text, Transform parent, Vector3 localPosition, float size)
        {
            var labelObject = new GameObject($"Label {text}");
            labelObject.transform.SetParent(parent);
            labelObject.transform.localPosition = localPosition;
            labelObject.transform.localRotation = Quaternion.identity;
            var mesh = labelObject.AddComponent<TextMesh>();
            mesh.text = text;
            mesh.alignment = TextAlignment.Center;
            mesh.anchor = TextAnchor.MiddleCenter;
            mesh.characterSize = size;
            mesh.fontSize = 64;
            mesh.color = paper;
            if (uiFont != null) mesh.font = uiFont;
        }

        private GameObject CreatePanel(string name, Transform parent, Color color)
        {
            var panel = new GameObject(name);
            panel.transform.SetParent(parent, false);
            var image = panel.AddComponent<Image>();
            image.color = color;
            return panel;
        }

        private Text CreateText(string name, Transform parent, string value, int fontSize, TextAnchor anchor, Color color)
        {
            var textObject = new GameObject(name);
            textObject.transform.SetParent(parent, false);
            var text = textObject.AddComponent<Text>();
            text.text = value;
            text.font = uiFont;
            text.fontSize = fontSize;
            text.alignment = anchor;
            text.color = color;
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Overflow;
            return text;
        }

        private Button CreateButton(string name, Transform parent, string label, Vector2 anchoredPosition)
        {
            var buttonObject = CreatePanel(name, parent, new Color(0.949f, 0.757f, 0.306f, 0.18f));
            var rect = buttonObject.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = new Vector2(260f, 72f);
            var button = buttonObject.AddComponent<Button>();

            Text text = CreateText($"{name} Text", buttonObject.transform, label, 30, TextAnchor.MiddleCenter, paper);
            SetRect(text.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            return button;
        }

        private static void SetRect(RectTransform rect, Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPosition, Vector2 sizeDelta)
        {
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = sizeDelta;
        }
    }
}
