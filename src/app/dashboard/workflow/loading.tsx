export default function WorkflowLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-6">
        <div className="w-64 h-[600px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 h-[600px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-64 h-[600px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
} 