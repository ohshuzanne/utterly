import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TaggedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: {
    id: string;
    name: string;
    type: 'member' | 'project';
  }[];
  className?: string;
}

export function TaggedTextarea({ value, onChange, placeholder, suggestions, className }: TaggedTextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [currentTag, setCurrentTag] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(currentTag.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          insertTag(filteredSuggestions[suggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestionIndex, filteredSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const lastAtSymbol = newValue.lastIndexOf('@');
    if (lastAtSymbol !== -1) {
      const textAfterAt = newValue.slice(lastAtSymbol + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      const tag = spaceIndex === -1 ? textAfterAt : textAfterAt.slice(0, spaceIndex);
      
      setCurrentTag(tag);
      setShowSuggestions(true);
      setSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertTag = (suggestion: { id: string; name: string; type: 'member' | 'project' }) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const lastAtSymbol = text.lastIndexOf('@', start);
    
    if (lastAtSymbol !== -1) {
      const newText = text.slice(0, lastAtSymbol) + 
        `@[${suggestion.name}](${suggestion.type}:${suggestion.id})` + 
        text.slice(end);
      
      onChange(newText);
      setShowSuggestions(false);
      setCurrentTag('');
    }
  };

  const renderContent = () => {
    const parts = value.split(/(@\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[([^\]]+)\]\(([^:]+):([^)]+)\)/);
      if (match) {
        const [, name] = match;
        return (
          <span key={index} className="bg-[#d3ffb8] px-1 rounded">
            @{name}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="min-h-[100px] p-2 border rounded-md whitespace-pre-wrap bg-white">
        {renderContent()}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="absolute inset-0 opacity-0 cursor-text"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === suggestionIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => insertTag(suggestion)}
            >
              <span className="font-medium">{suggestion.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({suggestion.type})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 