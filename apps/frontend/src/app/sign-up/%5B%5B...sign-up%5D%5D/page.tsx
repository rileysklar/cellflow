import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-slate-800 hover:bg-slate-900',
            footerActionLink: 'text-slate-800 hover:text-slate-900',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/onboarding"
      />
    </div>
  );
} 