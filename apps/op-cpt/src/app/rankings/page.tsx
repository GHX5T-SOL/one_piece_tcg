import { Crown, ShieldCheck, Trophy } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar } from "@/lib/products";
import { rankings } from "@/lib/seed-data";

export const metadata = {
  title: "Rankings | The Vault Room",
  description: "Cape Town collector and player rankings for The Vault Room member beta."
};

export default function RankingsPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Cape Town leaderboard</span>
        <h1>Player & collector rankings</h1>
        <p>
          A beta leaderboard for tournament points, collection showcases, trade trust, and event participation. Public rankings will be opt-in
          when profiles go live.
        </p>
      </section>

      <section className="leaderboard-table">
        {rankings.map((row) => (
          <article key={row.handle}>
            <div>
              {row.rank === 1 ? <Crown aria-hidden size={24} /> : <Trophy aria-hidden size={22} />}
              <strong>#{row.rank}</strong>
            </div>
            <span>{row.handle}</span>
            <em>{row.specialty}</em>
            <b>{row.battlePoints.toLocaleString("en-ZA")} pts</b>
            <small>{formatZar(row.collectionValueZar)} showcase</small>
          </article>
        ))}
      </section>

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Opt-in visibility</h2>
          <p>
            Collection-value rankings should require member consent, private-card exclusions, and evidence-based pricing labels before the
            leaderboard is treated as official.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
