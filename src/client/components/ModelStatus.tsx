import React from 'react';

interface ModelStatusProps {
  model: string;
}

const ModelStatus = ({ model }: ModelStatusProps) => {
  if (!model) return null;

  return (
    <div className="text-sm text-yellow-500 flex flex-col items-center gap-2" data-testid="model-status">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 border border-yellow-500 rounded-md text-[10px] font-medium animate-pulse">
          {model}
        </span>
      </div>
    </div>
  );
};

export default ModelStatus;
