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
            className={`px-5 py-2.5 rounded-none text-xs font-semibold tracking-wider uppercase transition-all duration-200 border
              ${isSelected 
                ? 'bg-[#1A3A5C] text-white border-[#1A3A5C] shadow-sm scale-[1.02]' 
                : 'bg-transparent text-[#1A3A5C]/70 border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C]'
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
