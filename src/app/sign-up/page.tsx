import CustomSignUp from "@/app/components/auth/CustomSignUp";

export default function SignUpPage() {
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

      {/* Sign Up Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Register</h1>
          <p className="text-gray-600 mb-8">Complete your registration easily.</p>
          <CustomSignUp />
        </div>
      </div>
    </div>
  );
} 