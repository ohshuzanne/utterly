import { Sidebar } from '@/app/components/layout/Sidebar';
import { ChatbotUpload } from './ChatbotUpload';

export default function ChatbotPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-[60px] p-8">
        <ChatbotUpload />
      </main>
    </div>
  );
} 