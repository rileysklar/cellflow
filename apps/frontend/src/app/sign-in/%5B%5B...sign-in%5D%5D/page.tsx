import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-slate-800 hover:bg-slate-900',
            footerActionLink: 'text-slate-800 hover:text-slate-900',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
    </div>
  );
} 