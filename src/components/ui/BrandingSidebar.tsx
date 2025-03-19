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
          <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center font-medium text-center absolute top-0 left-4 shadow-sm">
            <span className="text-[#0b867f] transform rotate-[15deg] text-lg tracking-wide">
              Innovative
            </span>
            
            {/* Speech bubble tail */}
            <svg className="absolute -left-3 top-1/2 transform -translate-y-1/2" width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8.5L12 0V17L0 8.5Z" fill="white"/>
            </svg>
          </div>

          {/* Convenient bubble */}
          <div className="bg-white rounded-full w-44 h-44 flex items-center justify-center font-medium text-center absolute top-12 right-0 shadow-sm">
            <span className="text-gray-600 text-lg">
              Convenient
            </span>
            
            {/* Speech bubble tail */}
            <svg className="absolute -right-3 top-1/2 transform -translate-y-1/2" width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8.5L0 0V17L12 8.5Z" fill="white"/>
            </svg>
          </div>

          {/* Main bubble with automation text */}
          <div className="bg-white rounded-full w-72 h-72 flex items-center justify-center font-medium text-center absolute bottom-0 left-2 shadow-sm">
            <div className="relative h-full w-full">
              {/* Gear icon */}
              <div className="absolute top-[60px] left-[50px]">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.3 19.7L8.9 22H5.1L4.7 19.7C4.3 19.5 3.9 19.3 3.5 19L1.4 20.1L-0.1 16.9L1.6 15.2C1.6 14.8 1.5 14.4 1.5 14C1.5 13.6 1.5 13.2 1.6 12.8L-0.1 11.1L1.4 7.9L3.5 9C3.9 8.7 4.3 8.5 4.7 8.3L5.1 6H8.9L9.3 8.3C9.7 8.5 10.1 8.7 10.5 9L12.6 7.9L14.1 11.1L12.4 12.8C12.5 13.2 12.5 13.6 12.5 14C12.5 14.4 12.5 14.8 12.4 15.2L14.1 16.9L12.6 20.1L10.5 19C10.1 19.3 9.7 19.5 9.3 19.7ZM7 17C8.7 17 10 15.7 10 14C10 12.3 8.7 11 7 11C5.3 11 4 12.3 4 14C4 15.7 5.3 17 7 17Z" fill="#0b867f"/>
                  <path d="M19.3 22.3L19.7 20.3C20.1 20.2 20.4 20 20.7 19.8L22.5 20.8L23.5 18.9L22 17.6C22 17.4 22 17.2 22 17C22 16.8 22 16.6 22 16.4L23.6 15.1L22.6 13.2L20.7 14.2C20.4 14 20.1 13.8 19.7 13.7L19.3 11.7H17.1L16.7 13.7C16.3 13.8 16 14 15.7 14.2L13.9 13.2L12.9 15.1L14.4 16.4C14.4 16.6 14.4 16.8 14.4 17C14.4 17.2 14.4 17.4 14.4 17.6L12.8 18.9L13.8 20.8L15.7 19.8C16 20 16.3 20.2 16.7 20.3L17.1 22.3H19.3ZM18.2 18.5C17.1 18.5 16.2 17.8 16.2 17C16.2 16 17.1 15.3 18.2 15.3C19.3 15.3 20.2 16 20.2 17C20.2 17.8 19.3 18.5 18.2 18.5Z" fill="#0b867f"/>
                </svg>
              </div>
              
              {/* Text layout matching the curved layout in the image */}
              <div className="absolute w-full h-full flex items-center justify-center">
                <div className="text-[#0b867f] w-max relative left-6 top-5">
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 text-base">Where</div>
                    <div className="text-lg font-medium mb-1">automation meets</div>
                    <div className="absolute -bottom-8 -left-8 text-base">assurance</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Speech bubble tail - left side tail as in image */}
            <svg className="absolute -left-4 top-1/3 transform -translate-y-1/2 rotate-[30deg]" width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12L18 0V24L0 12Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 