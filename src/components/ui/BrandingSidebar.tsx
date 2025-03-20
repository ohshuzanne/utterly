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
        <div className="bg-gray-800 text-white p-3 px-4 rounded-lg mb-16 inline-block text-sm relative">
          <p>Testing chatbots doesn&apos;t have to be complicated.</p>
          <p>Utterly.ai guarantees that.</p>
          {/* Speech bubble tail */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-gray-800"></div>
        </div>

        {/* Feature Bubbles */}
        <div className="relative h-[400px]">
          {/* Innovative bubble */}
          <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center font-medium text-center absolute top-[4] left-[-40]">
            <span className="text-[#0b867f] transform rotate-[15deg] text-lg tracking-wide">
              Innovative
            </span>
            
            {/* Speech bubble tail */}
            <svg className="absolute -left-3 top-1/2 transform -translate-y-1/2" width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8.5L12 0V17L0 8.5Z" fill="white"/>
            </svg>
          </div>

          {/* Convenient bubble */}
          <div className="bg-white rounded-full w-44 h-44 flex items-center justify-center font-medium text-center absolute top-[20] left-65">
            <span className="text-gray-600 text-lg">
              Convenient
            </span>
            
            {/* Speech bubble tail */}
            <svg className="absolute -right-3 top-1/2 transform -translate-y-1/2" width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8.5L0 0V17L12 8.5Z" fill="white"/>
            </svg>
          </div>

          {/* Main bubble with automation text */}
          <div className="bg-white rounded-full w-72 h-72 flex items-center justify-center font-medium text-center absolute bottom-[-60px] left-4">
            <div className="relative h-full w-full">
              
              {/* Text layout matching the curved layout in the image */}
              <div className="absolute w-full h-full flex items-center justify-center">
                <div className="text-[#0b867f] w-max relative top-2">
                  <div className="relative">
                    <div className="text-lg font-medium"> Where automation meets assurance</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Speech bubble tail - left side tail as in image */}
            <svg className="absolute -left-2 top-1/3 transform -translate-y-1/2 rotate-[30deg]" width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12L18 0V24L0 12Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 