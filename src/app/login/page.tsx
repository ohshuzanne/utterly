import CustomLogin from '../components/auth/CustomLogin';
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

          <CustomLogin />
        </div>
      </div>
    </div>
  );
} 