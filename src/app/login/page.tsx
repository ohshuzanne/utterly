import { SignIn } from "@clerk/nextjs";

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

          {/* Robot Icon */}
          <div className="absolute bottom-12 right-12">
            <div className="text-teal-600 text-4xl">🤖</div>
          </div>
        </div>
      </div>

      {/* Sign In Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignIn appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-lg shadow-none",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-500",
          }
        }} />
      </div>
    </div>
  );
} 