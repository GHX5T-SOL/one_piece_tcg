export const sources = {
  psaInfra: 'PSA, May 14 2026',
  psaBandai: 'PSA x Bandai',
  psaBasics: 'PSA basics guide',
  bandai: 'Bandai IR 2025',
  op13: 'Official OP-13',
  eb03: 'Official EB-03',
  collectacon: 'Collect-a-Con Cape Town',
  cardCache: 'The Card Cache',
  tcgplayer: 'TCGplayer',
  cardmarket: 'Cardmarket',
};

export const chapters = [
  {key: 'hook', start: 0, end: 35, title: 'Grand Line Entry', source: ''},
  {key: 'context', start: 35, end: 85, title: 'Why One Piece Works', source: sources.psaBasics},
  {key: 'market', start: 85, end: 140, title: 'Market Map', source: `${sources.psaInfra} / ${sources.bandai}`},
  {key: 'portfolio', start: 140, end: 205, title: 'Ghost x Zoro Book', source: 'Collectr / Courtyard / Phygitals'},
  {key: 'strategy', start: 205, end: 275, title: 'Flip Plus Hold', source: `${sources.psaBasics} / ${sources.op13}`},
  {key: 'channels', start: 275, end: 335, title: 'Where Liquidity Lives', source: 'Marketplace and Cape Town source pass'},
  {key: 'action', start: 335, end: 390, title: '30 / 60 / 90', source: 'Scenario analysis'},
  {key: 'closing', start: 390, end: 400, title: 'Hold The Legends', source: ''},
] as const;

export const captions = [
  {start: 0, end: 10, text: 'Ghost and Zoro are entering the Grand Line of trading card investing.'},
  {start: 10, end: 22, text: 'The treasure is not one card. It is a repeatable system.'},
  {start: 22, end: 35, text: 'Buy real demand, protect downside, sell into hype, hold the legends.'},
  {start: 35, end: 50, text: 'One Piece has decades of character equity before the modern Bandai TCG even launched.'},
  {start: 50, end: 66, text: 'Collectors buy story, memory, identity, condition, and scarcity.'},
  {start: 66, end: 85, text: 'The strongest cards combine iconic character, hard-to-repeat source, and clean condition.'},
  {start: 85, end: 104, text: 'Pokemon is the mature liquidity benchmark. One Piece is the younger growth lane.'},
  {start: 104, end: 122, text: 'PSA reported a broad grading boom, and Bandai tied card-game growth to One Piece.'},
  {start: 122, end: 140, text: 'The careful claim: rising One Piece demand, not verified superiority over Pokemon.'},
  {start: 140, end: 158, text: 'Your visible Collectr book is small, focused, and already thematic.'},
  {start: 158, end: 178, text: 'Nami anchors the book. Zoro-Juurou gives the portfolio a personal identity.'},
  {start: 178, end: 205, text: 'Courtyard offers are disciplined, but low-grade slabs need strict buy ceilings.'},
  {start: 205, end: 225, text: 'Hold iconic characters and event context. Flip liquid but replaceable discounts.'},
  {start: 225, end: 250, text: 'Avoid weak low-grade slabs, thin comps, and sealed product above reason.'},
  {start: 250, end: 275, text: 'The goal is not the most cards. It is owning cards others will compete for.'},
  {start: 275, end: 295, text: 'Courtyard and Phygitals are useful slab lanes. TCGplayer and eBay widen buyer reach.'},
  {start: 295, end: 316, text: 'Cape Town gives you local price discovery: Collect-a-Con, Card Cache, TCGXchange, Wizards.'},
  {start: 316, end: 335, text: 'For local deals, use public meetups, references, cert photos, and no rushed payments.'},
  {start: 335, end: 356, text: 'Thirty days: receive, photograph, verify certs, and comp every inbound slab.'},
  {start: 356, end: 374, text: 'Sixty days: test liquidity and build the OP-13 and EB-03 watchlist.'},
  {start: 374, end: 390, text: 'Ninety days: rebalance toward holds, flips, and cash reserve.'},
  {start: 390, end: 400, text: 'Build the crew. Protect the treasure. Sell into hype. Hold the legends.'},
];

export const strategyRows = [
  {label: 'Hold', value: '60%', detail: 'Luffy, Zoro, Nami, Roger, Ace, Sabo, Shanks, promos'},
  {label: 'Flip', value: '25%', detail: 'Discounted duplicate slabs and replaceable liquid cards'},
  {label: 'Cash', value: '15%', detail: 'Reserve for distress buys, events, and MSRP sealed drops'},
];

export const marketplaceRows = [
  'Courtyard: slab bids and liquidity loops',
  'Phygitals: inbound slab sourcing',
  'TCGplayer: raw/singles seller reach',
  'eBay / PSA Vault: broad graded-slab buyers',
  'Cardmarket: European comps and price gaps',
  'Cape Town: Collect-a-Con, Card Cache, TCGXchange, Wizards',
];

export const scenarioRows = [
  {label: 'Conservative', range: '0-10%', width: 26},
  {label: 'Base', range: '10-25%', width: 52},
  {label: 'Upside', range: '25-45%', width: 82},
];
