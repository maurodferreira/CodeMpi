import { useRef, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  fontSize?: 'small' | 'medium' | 'large';
  lineWrapping?: boolean;
  lineNumbers?: boolean;
  indentSize?: 2 | 4;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  focusLabel?: string;
}

const EDITOR_FONT_SIZES = {
  small: 13,
  medium: 15,
  large: 17,
} as const;

const MOBILE_CODE_TOOLS = [
  { label: '{ }', insert: '{}', cursorOffset: 1, ariaLabel: 'Inserir chaves' },
  { label: '( )', insert: '()', cursorOffset: 1, ariaLabel: 'Inserir parênteses' },
  { label: '[ ]', insert: '[]', cursorOffset: 1, ariaLabel: 'Inserir colchetes' },
  { label: '=>', insert: ' => ', cursorOffset: 4, ariaLabel: 'Inserir arrow function' },
  { label: ';', insert: ';', cursorOffset: 1, ariaLabel: 'Inserir ponto e vírgula' },
  { label: '=', insert: ' = ', cursorOffset: 3, ariaLabel: 'Inserir sinal de igualdade' },
] as const;

const MOBILE_CODE_SNIPPETS = [
  { label: 'const', insert: 'const ', cursorOffset: 6, ariaLabel: 'Inserir const' },
  { label: 'let', insert: 'let ', cursorOffset: 4, ariaLabel: 'Inserir let' },
  { label: 'return', insert: 'return ', cursorOffset: 7, ariaLabel: 'Inserir return' },
  { label: 'if', insert: 'if () {}', cursorOffset: 4, ariaLabel: 'Inserir estrutura if' },
  { label: 'else', insert: 'else {}', cursorOffset: 6, ariaLabel: 'Inserir estrutura else' },
  { label: 'for', insert: 'for () {}', cursorOffset: 5, ariaLabel: 'Inserir estrutura for' },
] as const;

export function CodeEditor({
  code,
  onChange,
  fontSize = 'medium',
  lineWrapping = true,
  lineNumbers = true,
  indentSize = 2,
  focusMode = false,
  onToggleFocus,
  focusLabel,
}: CodeEditorProps) {
  const editorFontSize = EDITOR_FONT_SIZES[fontSize];
  const editorViewRef = useRef<EditorView | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  const insertText = (text: string, cursorOffset = text.length) => {
    const view = editorViewRef.current;
    if (!view) return;

    const { main } = view.state.selection;

    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: text,
      },
      selection: {
        anchor: main.from + cursorOffset,
      },
      scrollIntoView: true,
    });

    view.focus();
  };

  const moveCursor = (direction: 'left' | 'right') => {
    const view = editorViewRef.current;
    if (!view) return;

    const { main } = view.state.selection;
    const position = direction === 'left'
      ? main.from
      : main.to;

    const nextPosition = direction === 'left'
      ? Math.max(0, position - 1)
      : Math.min(view.state.doc.length, position + 1);

    view.dispatch({
      selection: { anchor: nextPosition },
      scrollIntoView: true,
    });

    view.focus();
  };

  return (
    <div className="code-editor-shell">
      <div className="code-editor-topbar">
        <span className="code-editor-dot" />
        <span>desafio.js</span>
        <span className="code-editor-language">JavaScript</span>
        {focusMode && focusLabel && (
          <span className="code-editor-focus-label">{focusLabel}</span>
        )}
        {onToggleFocus && (
          <button
            type="button"
            className={`code-editor-focus-button ${focusMode ? 'active' : ''}`}
            aria-pressed={focusMode}
            aria-label={focusMode ? 'Sair do modo foco' : 'Entrar no modo foco'}
            title={focusMode ? 'Sair do modo foco' : 'Entrar no modo foco'}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onToggleFocus}
          >
            {focusMode ? 'Sair do foco' : 'Focar no código'}
          </button>
        )}
      </div>

      <CodeMirror
        value={code}
        height="300px"
        theme={oneDark}
        extensions={[
          javascript(),
          ...(lineWrapping ? [EditorView.lineWrapping] : []),
          keymap.of([...defaultKeymap, indentWithTab]),
          EditorState.tabSize.of(indentSize),
          EditorView.theme({
            '.cm-content': { fontSize: `${editorFontSize}px` },
            '.cm-gutters': { fontSize: `${editorFontSize}px` },
          }),
        ]}
        onCreateEditor={(view) => {
          editorViewRef.current = view;
        }}
        onChange={onChange}
        basicSetup={{
          lineNumbers,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
        }}
        className="code-editor"
      />

      <div className="mobile-code-toolbar" aria-label="Atalhos de programação">
        <div className="mobile-code-toolbar-scroll">
          {MOBILE_CODE_TOOLS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              aria-label={tool.ariaLabel}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertText(tool.insert, tool.cursorOffset)}
            >
              {tool.label}
            </button>
          ))}

          <button
            type="button"
            className="mobile-code-tool-wide"
            aria-label={`Inserir indentação de ${indentSize} espaços`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertText(' '.repeat(indentSize))}
          >
            TAB
          </button>

          <button
            type="button"
            aria-label="Mover cursor para a esquerda"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => moveCursor('left')}
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Mover cursor para a direita"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => moveCursor('right')}
          >
            →
          </button>

          <button
            type="button"
            className={`mobile-code-more-button ${showAdvancedTools ? 'active' : ''}`}
            aria-expanded={showAdvancedTools}
            aria-controls="mobile-code-toolbar-extra"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowAdvancedTools((previous) => !previous)}
          >
            {showAdvancedTools ? '× Fechar' : '+ Mais'}
          </button>
        </div>

        {showAdvancedTools && (
          <div className="mobile-code-toolbar-extra" id="mobile-code-toolbar-extra">
            <span className="mobile-code-toolbar-extra-label">ESTRUTURAS</span>
            <div className="mobile-code-toolbar-extra-scroll">
              {MOBILE_CODE_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.label}
                  type="button"
                  aria-label={snippet.ariaLabel}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => insertText(snippet.insert, snippet.cursorOffset)}
                >
                  {snippet.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
