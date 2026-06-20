import Link from "next/link";
import { Microscope, Ruler, ScanEye, ShieldCheck, type LucideIcon } from "lucide-react";
import { ProductActions } from "@/components/store/ProductActions";
import { ProductVisual } from "@/components/store/ProductVisual";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar, serviceProducts } from "@/lib/products";

const labItems: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Centering", body: "Measured border balance and visual alignment review.", icon: Ruler },
  { title: "Corners & edges", body: "Whitening, fray, chipping and factory-cut inspection.", icon: ScanEye },
  { title: "Surface", body: "Foil, scuffs, dimples, scratches and print-line review.", icon: Microscope },
  { title: "Authenticity", body: "Print, texture, finish and construction consistency notes.", icon: ShieldCheck }
];

export default function GradeLabPage() {
  const service = serviceProducts[0];

  return (
    <VaultRoomShell>
      <section className="service-hero">
        <div>
          <span>Grade Lab</span>
          <h1>Pre-Grading & Authentication</h1>
          <p>
            A per-card pre-grade opinion and authenticity assessment for collectors who want a cleaner read before grading, selling or
            trading.
          </p>
          <strong>{formatZar(150)} per card · shipping excluded if not dropped off</strong>
          {service && <ProductActions product={service} />}
        </div>
        {service && <ProductVisual product={service} />}
      </section>
      <section className="lab-grid">
        {labItems.map(({ title, body, icon: Icon }) => (
          <article key={title}>
            <Icon aria-hidden size={28} />
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="public-note-panel">
        <h2>Important grading note</h2>
        <p>
          This is an independent pre-grade opinion and candidate assessment. It does not guarantee a PSA, BGS or CGC outcome. Final grades
          are assigned only by the grading company.
        </p>
        <Link className="primary-action" href="/shop">
          Add service from shop
        </Link>
      </section>
    </VaultRoomShell>
  );
}
