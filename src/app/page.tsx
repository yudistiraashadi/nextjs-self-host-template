import { LoginForm } from "@/features/user/components/form/login-form";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Login</h1>

      <LoginForm />
    </div>
  );
}
