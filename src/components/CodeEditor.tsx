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
}

const EDITOR_FONT_SIZES = {
  small: 13,
  medium: 15,
  large: 17,
} as const;

export function CodeEditor({
  code,
  onChange,
  fontSize = 'medium',
  lineWrapping = true,
  lineNumbers = true,
  indentSize = 2,
}: CodeEditorProps) {
  const editorFontSize = EDITOR_FONT_SIZES[fontSize];
  return (
    <div className="code-editor-shell">
      <div className="code-editor-topbar">
        <span className="code-editor-dot" />
        <span>desafio.js</span>
        <span className="code-editor-language">JavaScript</span>
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
    </div>
  );
}
