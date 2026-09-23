interface ConceptVisualizerProps {
  levelIndex: number;
  exerciseTitle: string;
  tests: Array<{ args: unknown[]; exp: unknown }>;
  passed: number;
  total: number;
  isPassed: boolean;
}

interface N1Visual {
  formula: string;
  operator: string;
  sentence: string;
}

function displayValue(value: unknown) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  return JSON.stringify(value);
}

function getN1Visual(exerciseTitle: string): N1Visual {
  const title = exerciseTitle.toLowerCase();

  if (title.includes('soma')) return { formula: 'a + b', operator: '+', sentence: 'juntar dois valores' };
  if (title.includes('subtra')) return { formula: 'a − b', operator: '−', sentence: 'descobrir a diferença' };
  if (title.includes('dobro')) return { formula: 'n × 2', operator: '×2', sentence: 'multiplicar por dois' };
  if (title.includes('multiplica')) return { formula: 'a × b', operator: '×', sentence: 'multiplicar dois valores' };
  if (title.includes('divis')) return { formula: 'a ÷ b', operator: '÷', sentence: 'dividir um valor pelo outro' };
  if (title.includes('triplo')) return { formula: 'n × 3', operator: '×3', sentence: 'multiplicar por três' };
  if (title.includes('média')) return { formula: '(a + b + c) ÷ 3', operator: '÷3', sentence: 'combinar valores e dividir' };
  if (title.includes('resto')) return { formula: 'a % b', operator: '%', sentence: 'encontrar o que sobra' };
  if (title.includes('celsius')) return { formula: 'c × 9 ÷ 5 + 32', operator: '°F', sentence: 'converter uma temperatura' };
  if (title.includes('círculo')) return { formula: 'π × r × r', operator: 'π', sentence: 'calcular uma área' };

  return { formula: 'entrada → resultado', operator: 'ƒ', sentence: 'transformar um valor' };
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

  if (levelIndex === 0) {
    const visual = getN1Visual(exerciseTitle);
    const inputs = firstTest?.args || [];
    const progress = total ? (passed / total) * 100 : 0;

    return (
      <section className={`concept-lab experiment-lab ${isPassed ? 'solved' : ''}`}>
        <div className="experiment-head">
          <div>
            <span>CODEMPI LAB · N1</span>
            <strong>Entenda a transformação</strong>
          </div>
          <span className="experiment-status">
            {isPassed ? '✓ CONFIRMADO' : 'EXPERIMENTO'}
          </span>
        </div>

        <div className="experiment-visual">
          <div className="experiment-side">
            <small>ENTRADA</small>
            <div className="experiment-values">
              {inputs.map((value, index) => (
                <span key={index}>
                  {inputs.length > 1 && <i>{String.fromCharCode(97 + index)}</i>}
                  {displayValue(value)}
                </span>
              ))}
            </div>
          </div>

          <div className="experiment-connector"><span /></div>

          <div className="experiment-operation">
            <small>SUA FUNÇÃO</small>
            <div className="operation-chip">
              <span>{visual.operator}</span>
              <strong>{visual.formula}</strong>
            </div>
            <em>{visual.sentence}</em>
          </div>

          <div className="experiment-connector"><span /></div>

          <div className="experiment-side output-side">
            <small>SAÍDA ESPERADA</small>
            <div className="experiment-result">{displayValue(firstTest?.exp)}</div>
          </div>
        </div>

        <div className="experiment-footer">
          <span className="experiment-footer-label">TESTES</span>
          <div className="experiment-tests">
            <b>{passed}/{total}</b>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>
    );
  }

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
            <strong>{displayValue(firstTest?.args[0])}</strong>
            {firstTest?.args[1] !== undefined && <small>+ {displayValue(firstTest.args[1])}</small>}
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

  const params = firstTest?.args || [];
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
          <div className="expected-value">{displayValue(firstTest?.exp)}</div>
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
