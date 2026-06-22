import Link from "next/link";
import { Camera, LockKeyhole, ShieldCheck } from "lucide-react";
import { CollectionWorkbench } from "@/components/community/CollectionWorkbench";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export const metadata = {
  title: "Collection Tools | The Vault Room",
  description: "The Vault Room beta collection, scanner, and portfolio tools for Cape Town collectors."
};

export default function CollectionPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Collector vault beta</span>
        <h1>Collection scanner & portfolio</h1>
        <p>
          Search the seeded Vault Room collection, draft new cards, choose privacy, and prepare cards for protocol-backed pricing. Camera
          recognition stays human-verified so variants, language, condition, and grading notes are not guessed.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#scanner">
            <Camera aria-hidden size={18} />
            Open scanner beta
          </a>
          <Link className="secondary-action" href="/profile">
            <LockKeyhole aria-hidden size={18} />
            Create profile
          </Link>
        </div>
      </section>
      <CollectionWorkbench />
      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Public or private by default</h2>
          <p>
            The member version will let collectors decide whether each card is private, members-only, or public showcase. Live value labels
            require pricing-protocol evidence instead of Collectr-only estimates.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
