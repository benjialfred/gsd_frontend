import React from 'react';
import { Trash2 } from 'lucide-react';

interface MessageReactionBarProps {
  onReact: (emoji: string) => void;
  onDelete?: () => void;
  isMine: boolean;
}

const QUICK_REACTIONS = ['❤️', '🙏', '✨', '😊', '👍', '😂'];

export default function MessageReactionBar({ onReact, onDelete, isMine }: MessageReactionBarProps) {
  return (
    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-[#EFECE6] px-2 py-1 select-none animate-in zoom-in-90 fade-in duration-150 z-20">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact(emoji)}
          className="text-base sm:text-lg p-1 hover:scale-135 active:scale-95 transition-transform"
        >
          {emoji}
        </button>
      ))}

      {isMine && onDelete && (
        <>
          <div className="w-[1px] h-4 bg-gray-200 mx-1" />
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Supprimer ce message"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
}
