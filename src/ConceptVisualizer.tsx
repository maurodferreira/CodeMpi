interface ConceptVisualizerProps {
  levelIndex: number;
  exerciseTitle: string;
  tests: Array<{ args: unknown[]; exp: unknown }>;
  passed: number;
  total: number;
  isPassed: boolean;
}

interface MachineConfig {
  operator: string;
  formula: string;
  label: string;
}

function displayValue(value: unknown) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  return JSON.stringify(value);
}

function getN1Machine(exerciseTitle: string): MachineConfig {
  const title = exerciseTitle.toLowerCase();

  if (title.includes('soma')) return { operator: '+', formula: 'a + b', label: 'SOMADOR' };
  if (title.includes('subtra')) return { operator: '−', formula: 'a − b', label: 'SUBTRATOR' };
  if (title.includes('dobro')) return { operator: '×2', formula: 'n × 2', label: 'DUPLICADOR' };
  if (title.includes('multiplica')) return { operator: '×', formula: 'a × b', label: 'MULTIPLICADOR' };
  if (title.includes('divis')) return { operator: '÷', formula: 'a ÷ b', label: 'DIVISOR' };
  if (title.includes('triplo')) return { operator: '×3', formula: 'n × 3', label: 'TRIPLICADOR' };
  if (title.includes('média')) return { operator: '÷3', formula: '(a + b + c) ÷ 3', label: 'MÉDIA' };
  if (title.includes('resto')) return { operator: '%', formula: 'a % b', label: 'RESTO' };
  if (title.includes('celsius')) return { operator: '°F', formula: 'c × 9 ÷ 5 + 32', label: 'CONVERSOR' };
  if (title.includes('círculo')) return { operator: 'π', formula: 'π × r × r', label: 'GEOMETRIA' };

  return { operator: 'ƒ', formula: 'entrada → resultado', label: 'PROCESSADOR' };
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
  const expected = firstTest?.exp;

  if (levelIndex === 0) {
    const machine = getN1Machine(exerciseTitle);
    const inputs = firstTest?.args || [];
    const testProgress = total ? (passed / total) * 100 : 0;

    return (
      <section className={`concept-lab machine-lab ${isPassed ? 'solved' : ''}`}>
        <div className="machine-topbar">
          <div className="machine-identity">
            <span className="lab-eyebrow">CODEMPI LAB · MÁQUINA 01</span>
            <h3>Core de Transformação</h3>
            <p>Veja os dados entrando na máquina e entenda o papel da sua função.</p>
          </div>

          <div className="machine-status">
            <span className="status-light" />
            <div>
              <small>STATUS</small>
              <strong>{isPassed ? 'PROCESSO CONCLUÍDO' : 'AGUARDANDO CÓDIGO'}</strong>
            </div>
          </div>
        </div>

        <div className="machine-board">
          <div className="machine-track track-in">
            <span className="track-label">INPUT</span>
            <div className="input-capsules">
              {inputs.length ? inputs.map((value, index) => (
                <div className="input-capsule" key={index}>
                  <span>{inputs.length > 1 ? `VAR ${String.fromCharCode(65 + index)}` : 'VALOR'}</span>
                  <strong>{displayValue(value)}</strong>
                </div>
              )) : (
                <div className="input-capsule muted-capsule">aguardando entrada</div>
              )}
            </div>
          </div>

          <div className="machine-rail">
            <span className="rail-dot" />
            <span className="rail-dot" />
            <span className="rail-dot" />
          </div>

          <div className="machine-core">
            <div className="core-ring ring-outer" />
            <div className="core-ring ring-inner" />
            <div className="core-center">
              <span>{machine.operator}</span>
            </div>
            <div className="core-label">
              <small>{machine.label}</small>
              <strong>{machine.formula}</strong>
            </div>
          </div>

          <div className="machine-rail output-rail">
            <span className="rail-dot" />
            <span className="rail-dot" />
            <span className="rail-dot" />
          </div>

          <div className="machine-track track-out">
            <span className="track-label">OUTPUT</span>
            <div className="output-box">
              <small>RESULTADO ESPERADO</small>
              <strong>{displayValue(expected)}</strong>
            </div>
          </div>
        </div>

        <div className="machine-footer">
          <div className="machine-explanation">
            <span className="explanation-icon">↳</span>
            <div>
              <small>IDEIA DO NÍVEL</small>
              <strong>Entrada → operação → resultado</strong>
            </div>
          </div>

          <div className="machine-tests">
            <div className="tests-copy">
              <span>DIAGNÓSTICO</span>
              <strong>{passed} / {total} testes</strong>
            </div>
            <div className="machine-progress">
              <span style={{ width: `${testProgress}%` }} />
            </div>
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
