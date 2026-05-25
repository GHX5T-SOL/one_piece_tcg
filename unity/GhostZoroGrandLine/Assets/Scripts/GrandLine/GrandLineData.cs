using System;

namespace GhostZoro.GrandLine
{
    [Serializable]
    public sealed class CardDatabase
    {
        public CardRecord[] cards;
        public NextBuyTarget[] nextBuyTargets;
    }

    [Serializable]
    public sealed class CardRecord
    {
        public string id;
        public string title;
        public string character;
        public string set;
        public string cardNumber;
        public string gradeCompany;
        public string grade;
        public string certNumber;
        public string platform;
        public string status;
        public float visibleMarketValueUsd;
        public string thesisRole;
        public string action;
        public int convictionScore;
        public int liquidityScore;
        public int riskScore;
        public string recommendation;
        public string riskNotes;
        public MediaRecord media;
    }

    [Serializable]
    public sealed class MediaRecord
    {
        public string localImage;
        public string localVideo;
        public string officialArt;
    }

    [Serializable]
    public sealed class NextBuyTarget
    {
        public string priority;
        public string target;
        public string why;
    }

    [Serializable]
    public sealed class OfferDatabase
    {
        public OfferSummary summary;
        public OfferRecord[] offers;
    }

    [Serializable]
    public sealed class OfferSummary
    {
        public int openOffers;
        public float totalExposureUsd;
        public int psaOffers;
        public int cgcOffers;
        public float recommendedKeepExposureUsd;
        public float recommendedCancelExposureUsd;
        public string expiresText;
    }

    [Serializable]
    public sealed class OfferRecord
    {
        public string id;
        public string title;
        public string cardNumber;
        public string gradeCompany;
        public string grade;
        public string certNumber;
        public float offerUsd;
        public string status;
        public string action;
        public int score;
        public int priority;
        public string rationale;
        public float maxBidGuidanceUsd;
    }

    [Serializable]
    public sealed class ValuationDatabase
    {
        public ValuationSummary summary;
        public ProjectionBand[] projectionBands;
        public string[] rules;
        public string[] nextReviewTriggers;
    }

    [Serializable]
    public sealed class ValuationSummary
    {
        public float visibleCollectrValueUsd;
        public float openBidExposureUsd;
        public float illustrativeAtRiskStackUsd;
        public int ownedOnePieceCards;
        public int ownedOffThesisCards;
        public int inboundPhygitalsOnePieceCards;
        public int courtyardBoughtNotShippedCards;
        public int openCourtyardOffers;
    }

    [Serializable]
    public sealed class ProjectionBand
    {
        public string scenario;
        public float sixMonthValueUsd;
        public float twelveMonthValueUsd;
        public string assumption;
    }

    [Serializable]
    public sealed class DialogueDatabase
    {
        public NpcDialogue[] npcs;
    }

    [Serializable]
    public sealed class NpcDialogue
    {
        public string id;
        public string displayName;
        public string role;
        public string topic;
        public string summary;
        public string panel;
        public string[] dialogue;
    }

    [Serializable]
    public sealed class SourceDatabase
    {
        public SourceRecord[] sources;
    }

    [Serializable]
    public sealed class SourceRecord
    {
        public string id;
        public string title;
        public string publisher;
        public string url;
        public string retrievedAt;
        public string confidence;
        public string useCase;
        public string notes;
    }
}
