import { AuthPage } from "@/components/auth-page";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <AuthPage
      alternateHref="/signup"
      alternateLabel="Create account"
      alternateText="New here?"
      eyebrow="Welcome back"
      subtitle="Sign in to return to your dashboard and continue managing expenses."
      title="Sign in"
    >
        <AuthForm mode="login" />
    </AuthPage>
  );
}
