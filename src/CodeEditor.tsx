import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  // Função para permitir o uso da tecla TAB sem pular para outro botão da tela
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      
      // Mantém o cursor no lugar certo após o TAB
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      style={{
        width: '100%',
        minHeight: '280px',
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: 'var(--bg-2, #0D1917)',
        color: 'var(--text-1, #A0F0D8)',
        padding: '16px',
        border: '1px solid var(--border, #1A332B)',
        borderRadius: '8px',
        outline: 'none',
        resize: 'vertical',
        fontSize: '14px',
        lineHeight: '1.5'
      }}
    />
  );
}