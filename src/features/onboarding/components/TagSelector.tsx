import React from 'react';

interface TagOption {
  id: number | string;
  label: string;
}

interface TagSelectorProps {
  options: TagOption[];
  selectedIds: (number | string)[];
  onChange: (selectedIds: (number | string)[]) => void;
  maxSelection?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ options, selectedIds, onChange, maxSelection }) => {
  const toggleTag = (id: number | string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (maxSelection && selectedIds.length >= maxSelection) {
        return; // Reached limit
      }
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => toggleTag(option.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border
              ${isSelected 
                ? 'bg-[#8C9B90] text-white border-[#8C9B90] shadow-sm scale-[1.02]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#8C9B90] hover:bg-gray-50'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
