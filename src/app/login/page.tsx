import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#c0ff99] p-12 items-center justify-center relative">
        <div className="max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="bg-gray-800 text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold">
              U.
            </div>
          </div>

          {/* Text Content */}
          <div className="bg-gray-800 text-white p-4 rounded-lg mb-8 inline-block">
            <p>Testing chatbots doesn&apos;t have to be complicated.</p>
            <p>Utterly.ai guarantees that.</p>
          </div>

          {/* Feature Bubbles */}
          <div className="space-y-4">
            <div className="bg-white rounded-full px-6 py-3 inline-block text-teal-600">
              Innovative
            </div>
            <div className="bg-white rounded-full px-6 py-3 inline-block ml-12">
              Convenient
            </div>
            <div className="bg-white rounded-full px-6 py-3 inline-block">
              Where automation meets assurance
            </div>
          </div>

        </div>
      </div>

      {/* Sign In Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-600 mb-8">Login to continue testing.</p>
          
          {/* Temporary Development Link */}
          <div className="mb-4">
            <Link 
              href="/temp-login"
              className="w-full block text-center p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
            >
              Temporary Dashboard Access (Dev Only)
            </Link>
          </div>

          <SignIn appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "rounded-lg shadow-none",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-500",
              formFieldInput: "rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500",
              footerActionLink: "text-purple-600 hover:text-purple-500",
              formFieldLabel: "text-gray-700",
              identityPreviewText: "text-gray-700",
              formResendCodeLink: "text-purple-600 hover:text-purple-500",
              socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
              socialButtonsBlockButtonText: "text-gray-600",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldWarning: "text-yellow-600",
              formFieldError: "text-red-600",
              alert: "rounded-md",
              alertText: "text-sm",
            },
            variables: {
              colorPrimary: "#9333ea", 
              colorTextOnPrimaryBackground: "#ffffff",
              colorBackground: "#ffffff",
              colorText: "#374151",
              colorDanger: "#dc2626",
              colorSuccess: "#059669",
              colorWarning: "#d97706",
            },
          }} />
        </div>
      </div>
    </div>
  );
} 