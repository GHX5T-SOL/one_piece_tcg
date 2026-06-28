import { ProfileCommandCenter } from "@/components/ProfileCommandCenter";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function ProfilePage() {
  return (
    <VaultRoomShell>
      <ProfileCommandCenter />
    </VaultRoomShell>
  );
}
