import { BrandingSidebar } from '@/components/ui/BrandingSidebar';
import CustomLogin from '@/app/components/auth/CustomLogin';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <BrandingSidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <CustomLogin />
        </div>
      </div>
    </div>
  );
} 