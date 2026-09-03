// app/(auth)/register/page.tsx
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function RegisterPage() {
  return (
    <AuthShell
      kicker="First time here"
      title="Join the stand"
      subtitle="Create an account to save seats, get fixture alerts, and check out faster on matchday."
    >
      <SignupForm />
    </AuthShell>
  );
}