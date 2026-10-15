import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  isError?: boolean;
  mask?: boolean;
  autoFocus?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
  isError = false,
  mask = true,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const char = val[val.length - 1]; // Dernier chiffre saisi
    const nextArr = value.split('');
    while (nextArr.length < length) nextArr.push('');
    nextArr[index] = char;
    const newPin = nextArr.slice(0, length).join('');
    onChange(newPin);

    // Auto focus next
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.length === length && onComplete) {
      onComplete(newPin);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0 && inputRefs.current[index - 1]) {
        // Reculer d'une case si la case actuelle est vide
        inputRefs.current[index - 1]?.focus();
        const nextArr = value.split('');
        nextArr[index - 1] = '';
        onChange(nextArr.join(''));
      } else {
        const nextArr = value.split('');
        nextArr[index] = '';
        onChange(nextArr.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const targetIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[targetIdx]?.focus();

    if (pasted.length === length && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-3 sm:gap-4 my-2"
      animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {Array.from({ length }).map((_, index) => {
        const char = value[index] || '';
        const isFilled = Boolean(char);

        return (
          <div key={index} className="relative">
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={char}
              disabled={disabled}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border transition-all outline-none font-serif ${
                isError 
                  ? 'border-red-400 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-200' 
                  : isFilled
                    ? 'border-[#C9A84C] bg-[#FAF9F6] text-[#1A3A5C] shadow-sm'
                    : 'border-gray-200 bg-white text-[#1A3A5C] hover:border-gray-300 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
              }`}
            />
            {mask && isFilled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-3.5 h-3.5 rounded-full bg-[#1A3A5C]" />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};
