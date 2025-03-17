'use client';

interface TestingTrafficProps {
  data: number[];
}

export function TestingTraffic({ data }: TestingTrafficProps) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="p-6 border rounded-lg">
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Testing Traffic</h3>
        <p className="text-2xl font-bold">{data.reduce((a, b) => a + b, 0)}</p>
      </div>
      
      <div className="h-32 flex items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-teal-500 rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              height: `${(value / maxValue) * 100}%`,
              opacity: value > 0 ? (value / maxValue) * 0.3 + 0.7 : 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
} 