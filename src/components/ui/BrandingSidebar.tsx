'use client';

export function BrandingSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#c0ff99] p-12 items-center justify-center relative">
      <div className="max-w-md">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <div className="bg-gray-800 text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold">
            U.
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-gray-800 text-white p-2 px-3 rounded-lg mb-8 inline-block text-sm">
          <p>Testing chatbots doesn&apos;t have to be complicated.</p>
          <p>Utterly.ai guarantees that.</p>
        </div>

        {/* Feature Bubbles */}
        <div className="relative">
          <div className="bg-white rounded-full p-6 w-24 h-24 flex items-center justify-center text-teal-600 font-medium text-center absolute top-10 left-0">
            Innovative
          </div>
          <div className="bg-white rounded-full p-6 w-32 h-32 flex items-center justify-center font-medium text-gray-600 text-center absolute top-0 right-0">
            Convenient
          </div>
          <div className="bg-white rounded-full p-8 w-48 h-48 flex items-center justify-center text-teal-600 font-medium text-center mt-24">
            <div className="transform -rotate-12">
              <div className="text-xs mb-1">Where</div>
              <div className="text-sm mb-1">automation meets</div>
              <div className="text-xs">assurance</div>
            </div>
            <div className="absolute bottom-12 left-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10L10 15L15 10" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 