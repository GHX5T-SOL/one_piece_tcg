import { VaultGachaExperience } from "@/components/gacha/VaultGachaExperience";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { gachaPacks, gachaPrizes } from "@/lib/gacha";

export const metadata = {
  title: "Vault Gacha Demo | The Vault Room",
  description: "A cinematic coming-soon gacha and digital pack-rip demo for The Vault Room Cape Town collector community."
};

export default function GachaPage() {
  return (
    <VaultRoomShell>
      <VaultGachaExperience packs={gachaPacks} prizes={gachaPrizes} />
    </VaultRoomShell>
  );
}
