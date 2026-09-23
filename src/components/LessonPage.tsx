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
  return (
<main className="lesson-page">
          <div className="lesson-toolbar">
            <button className="text-action" onClick={() => setView('map')}>← Voltar para a jornada</button>
            <span>{currentLesson.levelTag} · AULA GUIADA</span>
          </div>

          <section className="lesson-card">
            <div className="lesson-progress">
              <span>PASSO {lessonStep + 1} DE {currentLesson.steps.length}</span>
              <div className="progress-bar"><span style={{ width: `${((lessonStep + 1) / currentLesson.steps.length) * 100}%` }} /></div>
            </div>

            <div className="lesson-reward-strip">
              <span className="lesson-reward-icon">✦</span>
              <div>
                <strong>{lessonCompletion ? `Aula concluída · +${lessonReward} XP recebidos` : `Conclua a aula e receba +${lessonReward} XP`}</strong>
                <small>{lessonCompletion ? 'Você pode revisitar esta aula quando quiser.' : 'Uma pequena recompensa por completar a preparação antes da prática.'}</small>
              </div>
              {lessonCompletion && <span className="lesson-reward-check">✓</span>}
            </div>

            <div className="lesson-content">
              <span className="eyebrow">{currentLessonStep.eyebrow}</span>
              <h1>{currentLessonStep.title}</h1>
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
                  <strong>{currentLessonStep.quiz.question}</strong>
                  <div className="quiz-options">
                    {currentLessonStep.quiz.options.map((option, index) => {
                      const selected = quizAnswer === index;
                      const answered = quizAnswer !== null;
                      const correct = index === currentLessonStep.quiz!.answer;
                      return (
                        <button
                          key={option}
                          className={`quiz-option ${selected ? 'selected' : ''} ${answered && correct ? 'correct' : ''} ${answered && selected && !correct ? 'wrong' : ''}`}
                          onClick={() => setQuizAnswer(index)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>{option}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswer !== null && (
                    <div className={`quiz-feedback ${quizAnswer === currentLessonStep.quiz.answer ? 'correct' : 'wrong'}`}>
                      {quizAnswer === currentLessonStep.quiz.answer ? '✓ Acertou! ' : '↻ Ainda não. '}
                      {currentLessonStep.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lesson-footer">
              <span>{lessonStep === 0 ? 'Começando pelo básico' : 'Você está avançando'}</span>
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
