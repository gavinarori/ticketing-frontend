// app/(auth)/login/page.tsx
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

  function LoginPage() {
  return (
    <AuthShell
      kicker="Matchday access"
      title="Know your seat"
      subtitle="Sign in to browse fixtures, hold seats, and step into the view before you buy."
    >
      <LoginForm />
    </AuthShell>
  );
}

export default LoginPage;