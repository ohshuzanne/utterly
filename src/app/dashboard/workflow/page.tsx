import { Sidebar } from '@/app/components/layout/Sidebar';
import WorkflowBuilder from './WorkflowBuilder';

export default function WorkflowPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[60px]">
        <WorkflowBuilder />
      </div>
    </div>
  );
} 