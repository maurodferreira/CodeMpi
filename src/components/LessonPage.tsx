import type { Dispatch, SetStateAction } from 'react';
import type { LevelLesson } from '../data/lessons';
import type { View } from '../types';

interface LessonPageProps {
  currentLesson: LevelLesson;
  currentLessonStep: LevelLesson['steps'][number];
  lessonStep: number;
  lessonReward: number;
  lessonCompletion: boolean;
  quizAnswer: number | null;
  setLessonStep: Dispatch<SetStateAction<number>>;
  setQuizAnswer: Dispatch<SetStateAction<number | null>>;
  handleLessonFinish: () => void;
  setView: Dispatch<SetStateAction<View>>;
}

const STEP_LABELS: Record<LevelLesson['steps'][number]['type'], string> = {
  concept: 'Entenda a ideia',
  example: 'Veja na prática',
  quiz: 'Teste seu entendimento',
  checkpoint: 'Prepare-se para a missão',
};

export function LessonPage({
  currentLesson,
  currentLessonStep,
  lessonStep,
  lessonReward,
  lessonCompletion,
  quizAnswer,
  setLessonStep,
  setQuizAnswer,
  handleLessonFinish,
  setView,
}: LessonPageProps) {
  const isQuiz = currentLessonStep.type === 'quiz';
  const stepLabel = STEP_LABELS[currentLessonStep.type];
  const progressPercent = ((lessonStep + 1) / currentLesson.steps.length) * 100;
  const isLastStep = lessonStep === currentLesson.steps.length - 1;

  return (
    <main className="lesson-page">
      <div className="lesson-toolbar">
        <button className="text-action" onClick={() => setView('map')}>← Voltar para a jornada</button>
        <span>{currentLesson.levelTag} · AULA GUIADA</span>
      </div>

      <section className="lesson-card">
        <div className="lesson-progress">
          <span>PASSO {lessonStep + 1} DE {currentLesson.steps.length}</span>
          <div className="progress-bar" aria-label={`Progresso da aula: ${Math.round(progressPercent)}%`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="lesson-intro">
          <div>
            <span className="lesson-intro-eyebrow">{currentLesson.levelTag} · PREPARAÇÃO</span>
            <h1>{currentLesson.title}</h1>
            <p>{currentLesson.subtitle}</p>
          </div>
          <div className="lesson-intro-goal">
            <span>ANTES DA MISSÃO</span>
            <strong>Entenda → pratique → avance</strong>
          </div>
        </div>

        {(isLastStep || lessonCompletion) && (
          <div className="lesson-reward-strip">
          <span className="lesson-reward-icon">✦</span>
          <div>
            <strong>{lessonCompletion ? `Aula concluída · +${lessonReward} XP recebidos` : `Conclua a aula e receba +${lessonReward} XP`}</strong>
            <small>{lessonCompletion ? 'Você pode revisitar esta aula quando quiser.' : 'Uma pequena recompensa por completar a preparação antes da prática.'}</small>
          </div>
            {lessonCompletion && <span className="lesson-reward-check">✓</span>}
          </div>
        )}

        <div className="lesson-content">
          <div className="lesson-step-heading">
            <span className="eyebrow">{currentLessonStep.eyebrow}</span>
            <span className="lesson-step-label">{stepLabel}</span>
          </div>
          <h2>{currentLessonStep.title}</h2>
          <p className="lesson-body">{currentLessonStep.body}</p>

          {currentLessonStep.code && (
            <pre className="lesson-code"><code>{currentLessonStep.code}</code></pre>
          )}

          {currentLessonStep.explanation && (
            <div className="lesson-explanation">
              <span>💡</span>
              <div><strong>Por que isso funciona?</strong><p>{currentLessonStep.explanation}</p></div>
            </div>
          )}

          {currentLessonStep.quiz && (
            <div className="lesson-quiz">
              <div className="lesson-quiz-heading">
                <span>{isQuiz ? 'PARE E PENSE' : 'TESTE'}</span>
                <strong>{currentLessonStep.quiz.question}</strong>
              </div>
              <div className="quiz-options">
                {currentLessonStep.quiz.options.map((option, index) => {
                  const selected = quizAnswer === index;
                  const answered = quizAnswer !== null;
                  const correct = index === currentLessonStep.quiz!.answer;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`quiz-option ${selected ? 'selected' : ''} ${answered && correct ? 'correct' : ''} ${answered && selected && !correct ? 'wrong' : ''}`}
                      aria-pressed={selected}
                      disabled={answered}
                      onClick={() => setQuizAnswer(index)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  );
                })}
              </div>
              {quizAnswer !== null && (
                <div
                  className={`quiz-feedback ${quizAnswer === currentLessonStep.quiz.answer ? 'correct' : 'wrong'}`}
                  aria-live="polite"
                >
                  {quizAnswer === currentLessonStep.quiz.answer
                    ? '✓ Acertou! '
                    : '↻ Ainda não. Tente novamente e revise a explicação. '}
                  {currentLessonStep.quiz.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lesson-footer">
          <span>{lessonStep === 0 ? 'Começando pelo básico' : lessonStep === currentLesson.steps.length - 1 ? 'Último passo antes da prática' : 'Você está avançando'}</span>
          <div>
            {lessonStep > 0 && (
              <button className="btn ghost" onClick={() => { setLessonStep((prev) => prev - 1); setQuizAnswer(null); }}>
                ← Voltar
              </button>
            )}
            {lessonStep < currentLesson.steps.length - 1 ? (
              <button
                className="btn primary"
                disabled={currentLessonStep.type === 'quiz' && quizAnswer === null}
                onClick={() => {
                  if (currentLessonStep.type === 'quiz' && quizAnswer !== currentLessonStep.quiz?.answer) {
                    setQuizAnswer(null);
                    return;
                  }
                  setLessonStep((prev) => prev + 1);
                  setQuizAnswer(null);
                }}
              >
                {currentLessonStep.type === 'quiz' && quizAnswer !== currentLessonStep.quiz?.answer ? 'Tentar novamente →' : 'Continuar →'}
              </button>
            ) : (
              <button className="btn primary" onClick={handleLessonFinish}>
                {lessonCompletion ? 'Voltar para a missão →' : `Concluir aula · +${lessonReward} XP`}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}