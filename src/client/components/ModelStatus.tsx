import React from 'react';

interface ModelStatusProps {
  model: string;
}

const ModelStatus = ({ model }: ModelStatusProps) => {
  if (!model) return null;

  const getFriendlyName = (name: string) => {
    const names: Record<string, string> = {
      'gemini-3-pro-image-preview': 'Nano Banana Pro',
      'gemini-2.5-flash-image': 'Nano Banana'
    };
    return names[name] || name;
  };

  return (
    <div className="text-sm text-yellow-500 flex flex-col items-center gap-2 shrink-0" data-testid="model-status">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="px-2 py-0.5 border border-yellow-500 rounded-md text-[10px] font-medium animate-pulse">
          {getFriendlyName(model)}
        </span>
      </div>
    </div>
  );
};

export default ModelStatus;
