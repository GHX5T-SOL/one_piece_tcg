import { AppFrame } from "@/components/AppFrame";
import { rankings } from "@/lib/seed-data";

export default function RankingsPage() {
  return (
    <AppFrame active="/rankings">
      <section className="page-shell">
        <div className="section-heading">
          <p>Player and collection leaderboard</p>
          <h1>Rankings</h1>
          <span>Seeded member-beta standings. Real results can be admin-entered after game nights.</span>
        </div>
        <div className="leaderboard">
          {rankings.map((row) => (
            <article className="leaderboard-row" key={row.handle}>
              <span>#{row.rank}</span>
              <strong>{row.handle}</strong>
              <em>{row.specialty}</em>
              <b>{row.battlePoints} pts</b>
              <small>Collection R {row.collectionValueZar.toLocaleString("en-ZA")}</small>
            </article>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
