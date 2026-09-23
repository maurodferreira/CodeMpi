interface ConceptVisualizerProps {
  levelIndex: number;
  exerciseTitle: string;
  tests: Array<{ args: unknown[]; exp: unknown }>;
  passed: number;
  total: number;
  isPassed: boolean;
}

function displayValue(value: unknown) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  return JSON.stringify(value);
}

export function ConceptVisualizer({
  levelIndex,
  exerciseTitle,
  tests,
  passed,
  total,
  isPassed,
}: ConceptVisualizerProps) {
  const firstTest = tests[0];
  const inputA = firstTest?.args[0];
  const inputB = firstTest?.args[1];
  const expected = firstTest?.exp;

  if (levelIndex === 1) {
    const condition = exerciseTitle.toLowerCase().includes('par')
      ? `n % 2 === 0`
      : exerciseTitle.toLowerCase().includes('senha')
        ? `senha.length >= 8`
        : exerciseTitle.toLowerCase().includes('frete')
          ? `valor >= 200 || assinante`
          : 'condição';

    return (
      <section className={`concept-lab conditional-lab ${isPassed ? 'solved' : ''}`}>
        <div className="lab-header">
          <div>
            <span className="lab-eyebrow">CODEMPI LAB · VISUALIZADOR</span>
            <h3>Veja a decisão antes de pensar no código.</h3>
          </div>
          <span className="lab-status">{isPassed ? '✓ DECISÃO RESOLVIDA' : '● SIMULANDO'}</span>
        </div>

        <div className="decision-flow">
          <div className="lab-node input-node">
            <span className="lab-node-label">ENTRADA</span>
            <strong>{displayValue(inputA)}</strong>
            {inputB !== undefined && <small>+ {displayValue(inputB)}</small>}
          </div>

          <div className="flow-line"><span /></div>

          <div className="lab-gate">
            <span className="gate-shape" />
            <div>
              <span>REGRA</span>
              <strong>{condition}</strong>
            </div>
          </div>

          <div className="branch-lines">
            <div className="branch true-branch"><i /> <span>TRUE</span></div>
            <div className="branch false-branch"><i /> <span>FALSE</span></div>
          </div>

          <div className="decision-results">
            <div><span>SAÍDA A</span><strong>seguir caminho</strong></div>
            <div><span>SAÍDA B</span><strong>seguir outro caminho</strong></div>
          </div>
        </div>
      </section>
    );
  }

  const params = tests[0]?.args || [];
  const slots = params.map((value, index) => ({
    label: String.fromCharCode(65 + index),
    value: displayValue(value),
  }));

  return (
    <section className={`concept-lab dataflow-lab ${isPassed ? 'solved' : ''}`}>
      <div className="lab-header">
        <div>
          <span className="lab-eyebrow">CODEMPI LAB · VISUALIZADOR</span>
          <h3>Transforme entradas em um resultado.</h3>
        </div>
        <span className="lab-status">{isPassed ? '✓ FLUXO CONFIRMADO' : '● MODO EXPLORAÇÃO'}</span>
      </div>

      <div className="data-flow">
        <div className="flow-stage">
          <span className="stage-label">ENTRADAS</span>
          <div className="value-stack">
            {slots.length > 0 ? slots.map((slot) => (
              <div className="value-chip" key={slot.label}>
                <small>{slot.label}</small>
                <strong>{slot.value}</strong>
              </div>
            )) : <div className="value-chip empty">Aguardando</div>}
          </div>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-stage core-stage">
          <span className="stage-label">SUA FUNÇÃO</span>
          <div className="core-orb">
            <span>{exerciseTitle.split(' ')[0]}</span>
            <i />
          </div>
          <small>processar · transformar · devolver</small>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-stage">
          <span className="stage-label">RESULTADO ESPERADO</span>
          <div className="expected-value">{displayValue(expected)}</div>
        </div>
      </div>

      <div className="lab-meter">
        <div>
          <span>TESTES</span>
          <strong>{passed}/{total}</strong>
        </div>
        <div className="lab-meter-track"><span style={{ width: `${total ? (passed / total) * 100 : 0}%` }} /></div>
      </div>
    </section>
  );
}
