'use client';

interface TestingTrafficProps {
  data: number[];
}

export function TestingTraffic({ data }: TestingTrafficProps) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="w-full">
      <div className="h-32 flex items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 transition-all duration-300 hover:opacity-80 relative group"
          >
            <div 
              className="absolute bottom-0 w-full rounded-full"
              style={{
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: value > 15 ? '#0d9488' : '#99f6e4',
                opacity: value > 15 ? 1 : 0.7,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 