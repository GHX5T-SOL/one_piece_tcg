import { AppFrame } from "@/components/AppFrame";
import { AuthPanel } from "@/components/AuthPanel";

export default function SignInPage() {
  return (
    <AppFrame active="/auth/sign-in">
      <AuthPanel />
    </AppFrame>
  );
}
