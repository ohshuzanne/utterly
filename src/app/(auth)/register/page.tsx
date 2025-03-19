import { BrandingSidebar } from '@/components/ui/BrandingSidebar';
import CustomSignUp from '@/app/components/auth/CustomSignUp';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <BrandingSidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <CustomSignUp />
        </div>
      </div>
    </div>
  );
} 