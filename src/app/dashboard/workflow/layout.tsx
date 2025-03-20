export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      {children}
    </div>
  );
} 