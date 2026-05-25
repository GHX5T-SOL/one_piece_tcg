import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Anchor, Compass, Gem, Route, ShieldCheck, TrendingUp} from 'lucide-react';
import portfolio from '../data/portfolio.collectr.json';
import offers from '../data/courtyard-offers.json';
import inbound from '../data/phygitals-inbound.json';
import {captions, chapters, marketplaceRows, scenarioRows, sources, strategyRows} from './content';
import {ThreeCardField} from './ThreeCardField';

const asset = (path: string) => staticFile(path);

const useSeconds = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

const currentChapter = (seconds: number) =>
  chapters.find((chapter) => seconds >= chapter.start && seconds < chapter.end) ?? chapters[chapters.length - 1];

const progressFor = (seconds: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (seconds - start) / (end - start)));

const Money = ({value}: {value: number}) => <>{`$${value.toLocaleString('en-US', {minimumFractionDigits: value % 1 ? 2 : 0})}`}</>;

const OceanBase: React.FC<{mode?: 'gold' | 'red' | 'teal'}> = ({mode = 'teal'}) => {
  const frame = useCurrentFrame();
  const waveX = interpolate(frame % 220, [0, 220], [-70, 0]);
  const tint = mode === 'gold' ? 'rgba(242,193,78,0.2)' : mode === 'red' ? 'rgba(229,75,75,0.2)' : 'rgba(18,199,184,0.18)';
  return (
    <AbsoluteFill className="ocean">
      <Img src={asset('assets/raw/drive/areamap_bg_0000_t.png')} className="map-bg" />
      <div className="sea-tiles" />
      <div className="vignette" />
      <div className="tint" style={{background: tint}} />
      <Img src={asset('assets/raw/drive/worldmap_008_wave.png')} className="wave wave-a" style={{transform: `translateX(${waveX}px)`}} />
      <Img src={asset('assets/raw/drive/worldmap_008_wave.png')} className="wave wave-b" style={{transform: `translateX(${-waveX - 90}px) scaleX(-1)`}} />
    </AbsoluteFill>
  );
};

const SourceChip: React.FC<{label?: string}> = ({label}) => {
  if (!label) return null;
  return (
    <div className="source-chip">
      <ShieldCheck size={18} />
      <span>{label}</span>
    </div>
  );
};

const Subtitle: React.FC = () => {
  const seconds = useSeconds();
  const active = captions.find((caption) => seconds >= caption.start && seconds < caption.end);
  if (!active) return null;
  const local = progressFor(seconds, active.start, active.end);
  const opacity = Math.min(interpolate(local, [0, 0.08], [0, 1]), interpolate(local, [0.86, 1], [1, 0]));
  return (
    <div className="subtitle" style={{opacity}}>
      {active.text}
    </div>
  );
};

const ChapterBug: React.FC = () => {
  const seconds = useSeconds();
  const chapter = currentChapter(seconds);
  return (
    <div className="chapter-bug">
      <Compass size={20} />
      <span>{chapter.title}</span>
    </div>
  );
};

const SlabCard: React.FC<{
  title: string;
  kicker: string;
  value: string;
  grade?: string;
  accent?: 'teal' | 'gold' | 'red' | 'silver';
  small?: boolean;
}> = ({title, kicker, value, grade = 'GEM', accent = 'teal', small = false}) => (
  <div className={`slab slab-${accent} ${small ? 'slab-small' : ''}`}>
    <div className="slab-top">
      <span>{grade}</span>
      <b>{accent === 'silver' ? '9' : '10'}</b>
    </div>
    <div className="card-art">
      <div className="foil-lines" />
      <Gem size={small ? 26 : 34} />
    </div>
    <div className="slab-body">
      <strong>{title}</strong>
      <span>{kicker}</span>
      <em>{value}</em>
    </div>
  </div>
);

const ShipLayer: React.FC<{variant?: 'single' | 'fleet'}> = ({variant = 'single'}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame % 320, [0, 320], [-240, 260]);
  const y = Math.sin(frame / 42) * 18;
  return (
    <>
      <Img src={asset('assets/raw/drive/ship_0057_c.png')} className="ship ship-main" style={{transform: `translate(${x}px, ${y}px) rotate(-3deg)`}} />
      {variant === 'fleet' ? (
        <Img src={asset('assets/raw/drive/ship_0060_c.png')} className="ship ship-secondary" style={{transform: `translate(${-x * 0.55}px, ${-y}px) rotate(4deg)`}} />
      ) : null}
    </>
  );
};

const HookScene: React.FC = () => {
  const seconds = useSeconds();
  const p = progressFor(seconds, 0, 35);
  const titleY = interpolate(p, [0, 0.22], [48, 0]);
  return (
    <AbsoluteFill>
      <OceanBase mode="gold" />
      <ThreeCardField opacity={0.25} />
      <ShipLayer />
      <div className="hero-title" style={{transform: `translateY(${titleY}px)`, opacity: interpolate(p, [0, 0.18], [0, 1])}}>
        <div className="eyebrow">Private investment brief</div>
        <h1>Ghost x Zoro</h1>
        <p>One Piece TCG: build the crew, protect the treasure, hold the legends.</p>
      </div>
      <div className="hero-slabs">
        <SlabCard title="Nami" kicker="CS 2023 Celebration Pack" value="$400 visible FMV" accent="red" grade="MINT" />
        <SlabCard title="Zoro-Juurou" kicker="ST18-004" value="$137.49 visible FMV" accent="teal" grade="PRISTINE" />
        <SlabCard title="Luffy Promo" kicker="P-041 / ST10" value="Hold lane" accent="gold" grade="GEM" />
      </div>
    </AbsoluteFill>
  );
};

const ContextScene: React.FC = () => {
  const seconds = useSeconds();
  const p = progressFor(seconds, 35, 85);
  return (
    <AbsoluteFill>
      <OceanBase />
      <Img src={asset('assets/raw/drive/motion_13818_luffy_0001.png')} className="portrait portrait-luffy" />
      <Img src={asset('assets/raw/drive/motion_13851_zoro_0001.png')} className="portrait portrait-zoro" />
      <Img src={asset('assets/raw/drive/motion_13815_nami_0001.png')} className="portrait portrait-nami" />
      <div className="panel left-panel">
        <div className="eyebrow">Why the IP matters</div>
        <h2>Story Power Becomes Collector Demand</h2>
        <p>Modern Bandai One Piece TCG launched after decades of manga and anime character equity.</p>
        <div className="tag-row">
          {['OP', 'ST', 'PR', 'Alt-Art', 'Promo', 'Pre-release', 'Anniversary'].map((tag, index) => (
            <span key={tag} style={{opacity: interpolate(p, [0.12 + index * 0.035, 0.24 + index * 0.035], [0, 1])}}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <SourceChip label={sources.psaBasics} />
    </AbsoluteFill>
  );
};

const MarketScene: React.FC = () => {
  const seconds = useSeconds();
  const p = progressFor(seconds, 85, 140);
  return (
    <AbsoluteFill>
      <OceanBase mode="red" />
      <ThreeCardField opacity={0.18} />
      <div className="comparison">
        <div className="market-card pokemon">
          <h3>Pokemon</h3>
          <p>Mature liquidity benchmark</p>
          <strong>Deep comps</strong>
          <span>Large buyer pool</span>
        </div>
        <div className="market-card onepiece">
          <h3>One Piece</h3>
          <p>Younger growth lane</p>
          <strong>High volatility</strong>
          <span>Character and event driven</span>
        </div>
      </div>
      <div className="metric-strip">
        <div style={{width: `${interpolate(p, [0.18, 0.55], [14, 100])}%`}} />
      </div>
      <div className="metric-copy">
        <TrendingUp size={40} />
        <div>
          <b>PSA: 2M cards in 2020 to 19M+ in 2025</b>
          <span>Bandai: One Piece drove card-game growth; Bandai ranked #3 global TCG share as of Mar 2025.</span>
        </div>
      </div>
      <div className="careful-claim">Careful claim: rising One Piece demand, not a verified Pokemon volume win.</div>
      <SourceChip label={`${sources.psaInfra} / ${sources.bandai}`} />
    </AbsoluteFill>
  );
};

const PortfolioScene: React.FC = () => {
  const holdings = portfolio.holdings.slice(0, 6);
  const visibleValue = portfolio.summary.visibleMarketValueUsd;
  return (
    <AbsoluteFill>
      <OceanBase />
      <ShipLayer variant="fleet" />
      <div className="scene-heading">
        <div className="eyebrow">Portfolio truth</div>
        <h2>Small Book, Strong Theme, Real Concentration</h2>
      </div>
      <div className="portfolio-grid">
        {holdings.map((item, index) => (
          <SlabCard
            key={item.title}
            title={item.title.replace(' (CS 2023 Celebration Pack)', '').replace(' (Premium Card Collection -ONE PIECE FILM RED Edition-)', '')}
            kicker={`${item.cardNumber} / ${item.rarity}`}
            value={item.marketValueUsd > 0 ? `$${item.marketValueUsd.toFixed(item.marketValueUsd % 1 ? 2 : 0)}` : item.strategyTag.toUpperCase()}
            grade={index === 0 ? 'MINT' : index === 1 ? 'PRISTINE' : 'GEM'}
            accent={index === 0 ? 'red' : index === 1 ? 'teal' : index === 2 ? 'gold' : 'silver'}
            small
          />
        ))}
      </div>
      <div className="portfolio-stats">
        <div><span>Visible Collectr</span><b><Money value={visibleValue} /></b></div>
        <div><span>Courtyard offers</span><b>{offers.summary.activeOffersVisible} / <Money value={offers.summary.totalOfferExposureUsd} /></b></div>
        <div><span>Phygitals inbound</span><b>{inbound.summary.itemsVisible} items / {inbound.summary.packagesVisible} shipments</b></div>
      </div>
      <SourceChip label="Collectr / Courtyard / Phygitals read-only capture" />
    </AbsoluteFill>
  );
};

const StrategyScene: React.FC = () => {
  const seconds = useSeconds();
  const p = progressFor(seconds, 205, 275);
  return (
    <AbsoluteFill>
      <OceanBase mode="gold" />
      <div className="strategy-board">
        <div className="scene-heading compact">
          <div className="eyebrow">Operating thesis</div>
          <h2>Balanced Flips Plus Holds</h2>
        </div>
        <div className="lane-grid">
          <div className="lane hold"><Anchor size={44} /><h3>Hold</h3><p>Iconic characters, event promos, anniversary, pre-release, WANTED, Super Alt-Art.</p></div>
          <div className="lane flip"><Route size={44} /><h3>Flip</h3><p>Discounted duplicates and liquid slabs bought below conservative sold comps.</p></div>
          <div className="lane avoid"><ShieldCheck size={44} /><h3>Avoid</h3><p>Weak low-grade slabs, thin listings, and sealed product above justified comp range.</p></div>
        </div>
        <div className="priority-list">
          {['Luffy', 'Zoro', 'Nami', 'Ace', 'Sabo', 'Roger', 'Shanks', 'Teach', 'Newgate'].map((name, index) => (
            <span key={name} style={{transform: `translateY(${interpolate(p, [0.08 + index * 0.025, 0.2 + index * 0.025], [22, 0])}px)`}}>
              {name}
            </span>
          ))}
        </div>
      </div>
      <SourceChip label={`${sources.psaBasics} / ${sources.op13}`} />
    </AbsoluteFill>
  );
};

const ChannelsScene: React.FC = () => (
  <AbsoluteFill>
    <OceanBase />
    <ShipLayer variant="fleet" />
    <div className="scene-heading">
      <div className="eyebrow">Liquidity map</div>
      <h2>Where To Buy, Sell, And Test Demand</h2>
    </div>
    <div className="channel-map">
      {marketplaceRows.map((row, index) => (
        <div className="channel-row" key={row}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{row}</p>
        </div>
      ))}
    </div>
    <div className="event-callout">
      <b>Collect-a-Con Cape Town</b>
      <span>June 6, 2026 / Fire and Ice Hotel signal / bring a price sheet and strict buy box.</span>
    </div>
    <SourceChip label="Collect-a-Con / Card Cache / TCGXchange / TCGplayer / Cardmarket" />
  </AbsoluteFill>
);

const ActionScene: React.FC = () => (
  <AbsoluteFill>
    <OceanBase mode="red" />
    <ThreeCardField opacity={0.16} />
    <div className="scene-heading">
      <div className="eyebrow">Capital plan</div>
      <h2>30 / 60 / 90-Day Operating Map</h2>
    </div>
    <div className="timeline">
      <div><b>30</b><span>Receive, photograph, verify certs, comp every slab.</span></div>
      <div><b>60</b><span>Test one sale, trade off-thesis inventory, build OP-13 and EB-03 watchlists.</span></div>
      <div><b>90</b><span>Rebalance to holds, flips, and cash reserve.</span></div>
    </div>
    <div className="allocation">
      {strategyRows.map((row) => (
        <div key={row.label}>
          <b>{row.label}</b>
          <span>{row.value}</span>
          <p>{row.detail}</p>
        </div>
      ))}
    </div>
    <div className="scenario">
      {scenarioRows.map((row) => (
        <div className="scenario-row" key={row.label}>
          <span>{row.label}</span>
          <div><i style={{width: `${row.width}%`}} /></div>
          <b>{row.range}</b>
        </div>
      ))}
    </div>
    <div className="disclaimer">Educational scenario analysis only. Not financial advice. Returns are not guaranteed.</div>
  </AbsoluteFill>
);

const ClosingScene: React.FC = () => (
  <AbsoluteFill>
    <OceanBase mode="gold" />
    <ThreeCardField opacity={0.2} />
    <ShipLayer />
    <div className="closing-copy">
      <h2>Build the crew.</h2>
      <h2>Protect the treasure.</h2>
      <h2>Sell into hype.</h2>
      <h2>Hold the legends.</h2>
      <p>Ghost x Zoro / Private One Piece TCG Investment Brief</p>
    </div>
  </AbsoluteFill>
);

const SceneSwitch: React.FC = () => {
  const seconds = useSeconds();
  if (seconds < 35) return <HookScene />;
  if (seconds < 85) return <ContextScene />;
  if (seconds < 140) return <MarketScene />;
  if (seconds < 205) return <PortfolioScene />;
  if (seconds < 275) return <StrategyScene />;
  if (seconds < 335) return <ChannelsScene />;
  if (seconds < 390) return <ActionScene />;
  return <ClosingScene />;
};

export const GhostZoroVideo: React.FC = () => (
  <AbsoluteFill className="root">
    <Audio src={asset('assets/generated/narration.wav')} volume={1} />
    <Audio src={asset('assets/generated/music-bed.wav')} volume={0.16} />
    <SceneSwitch />
    <ChapterBug />
    <Subtitle />
  </AbsoluteFill>
);
