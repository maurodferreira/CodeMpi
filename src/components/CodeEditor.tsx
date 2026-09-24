import { javascript } from '@codemirror/lang-javascript';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
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
          EditorView.lineWrapping,
          keymap.of([...defaultKeymap, indentWithTab]),
          EditorState.tabSize.of(2),
        ]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
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
