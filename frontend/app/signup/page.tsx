import { AuthPage } from "@/components/auth-page";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <AuthPage
      alternateHref="/login"
      alternateLabel="Sign in"
      alternateText="Already have an account?"
      eyebrow="Get started"
      subtitle="Create your account, then you will be redirected straight to the dashboard."
      title="Create account"
    >
        <AuthForm mode="signup" />
    </AuthPage>
  );
}
