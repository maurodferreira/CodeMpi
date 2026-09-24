import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: {
    middlewareMode: true,
  },
});

after(async () => {
  await vite.close();
});

const progress = await vite.ssrLoadModule('/src/utils/progress.ts');
const xp = await vite.ssrLoadModule('/src/utils/xp.ts');
const missionTargets = await vite.ssrLoadModule('/src/utils/missionTargets.ts');
const router = await vite.ssrLoadModule('/src/hooks/useAppRouter.ts');
const storeMigration = await vite.ssrLoadModule('/src/utils/storeMigration.ts');
const valueEquality = await vite.ssrLoadModule('/src/utils/valueEquality.ts');
const levelsModule = await vite.ssrLoadModule('/src/data/levels.ts');
const userRepository = await vite.ssrLoadModule('/src/services/userRepository.ts');
const persistenceModule = await vite.ssrLoadModule('/src/services/persistence.ts');
const progressRepositoryModule = await vite.ssrLoadModule('/src/services/progressRepository.ts');
const preferencesRepositoryModule = await vite.ssrLoadModule('/src/services/preferencesRepository.ts');
const themeRepositoryModule = await vite.ssrLoadModule('/src/services/themeRepository.ts');
const codeExecutorModule = await vite.ssrLoadModule('/src/services/codeExecutor.ts');
const workerExecutorModule = await vite.ssrLoadModule('/src/services/workerCodeExecutor.ts');
const executionPolicyModule = await vite.ssrLoadModule('/src/services/executionPolicy.ts');
const apiClientModule = await vite.ssrLoadModule('/src/services/apiClient.ts');
const authRepositoryModule = await vite.ssrLoadModule('/src/services/authRepository.ts');
const syncRepositoryModule = await vite.ssrLoadModule('/src/services/syncRepository.ts');
const cloudMigrationModule = await vite.ssrLoadModule('/src/services/cloudMigration.ts');
const cloudDomainModule = await vite.ssrLoadModule('/src/domain/cloud.ts');
const cloudConfigModule = await vite.ssrLoadModule('/src/config/cloud.ts');
const cloudServicesModule = await vite.ssrLoadModule('/src/services/cloudServices.ts');
const cloudSessionRepositoryModule = await vite.ssrLoadModule('/src/services/cloudSessionRepository.ts');
const apiServerConfigModule = await vite.ssrLoadModule('/server/config.ts');
const apiRouterModule = await vite.ssrLoadModule('/server/router.ts');
const apiServerModule = await vite.ssrLoadModule('/server/server.ts');
const databaseMigrationsModule = await vite.ssrLoadModule('/server/database/migrations.ts');

test('progress keys remain stable', () => {
  assert.equal(progress.getProgressKey(0, 0), '0-0');
  assert.equal(progress.getProgressKey(6, 9), '6-9');
});

test('local date key uses calendar date', () => {
  const date = new Date(2026, 8, 24, 14, 30, 0);
  assert.equal(progress.getLocalDateKey(date), '2026-09-24');
});

test('activity streak calculates current and best runs', () => {
  assert.deepEqual(
    progress.getActivityStreak([], '2026-09-24'),
    { current: 0, best: 0, activeToday: false },
  );

  assert.deepEqual(
    progress.getActivityStreak(
      ['2026-09-20', '2026-09-21', '2026-09-21', '2026-09-22', '2026-09-24'],
      '2026-09-24',
    ),
    { current: 1, best: 3, activeToday: true },
  );

  assert.deepEqual(
    progress.getActivityStreak(
      ['2026-09-20', '2026-09-21', '2026-09-22'],
      '2026-09-23',
    ),
    { current: 3, best: 3, activeToday: false },
  );
});

test('activity registration is deterministic and avoids duplicates', () => {
  assert.deepEqual(
    progress.addTodayActivity(
      ['2026-09-22', '2026-09-24', '2026-09-24'],
      '2026-09-23',
    ),
    ['2026-09-22', '2026-09-23', '2026-09-24'],
  );
});

test('hint multipliers clamp to the supported range', () => {
  assert.equal(xp.getHintMultiplier(-5), 1);
  assert.equal(xp.getHintMultiplier(0), 1);
  assert.equal(xp.getHintMultiplier(1), 0.9);
  assert.equal(xp.getHintMultiplier(2), 0.75);
  assert.equal(xp.getHintMultiplier(3), 0.5);
  assert.equal(xp.getHintMultiplier(4), 0.25);
  assert.equal(xp.getHintMultiplier(99), 0.25);
});

test('exercise XP respects hints and rounding', () => {
  assert.equal(xp.calculateExerciseXp(200, 0), 200);
  assert.equal(xp.calculateExerciseXp(200, 1), 180);
  assert.equal(xp.calculateExerciseXp(200, 2), 150);
  assert.equal(xp.calculateExerciseXp(200, 3), 100);
  assert.equal(xp.calculateExerciseXp(200, 4), 50);
  assert.equal(xp.calculateExerciseXp(125, 1), 113);
});

test('store migration preserves valid progress and removes only changed legacy keys', () => {
  const legacy = {
    done: {
      '0-5': 200,
      '2-1': 300,
    },
    hints: {
      '0-5': 2,
      '2-1': 1,
    },
    lessonDone: {
      0: true,
    },
    performance: {
      '0-5': { attempts: 4, failures: 2 },
      '2-1': { attempts: 2, failures: 1 },
    },
    activityDates: ['2026-09-20'],
    progressVersion: 1,
  };

  const snapshot = structuredClone(legacy);
  const migrated = storeMigration.migrateStore(legacy);

  assert.equal(migrated.progressVersion, storeMigration.CURRENT_PROGRESS_VERSION);
  assert.equal(migrated.done['0-5'], undefined);
  assert.equal(migrated.hints['0-5'], undefined);
  assert.equal(migrated.performance['0-5'], undefined);
  assert.equal(migrated.done['2-1'], 300);
  assert.equal(migrated.hints['2-1'], 1);
  assert.deepEqual(migrated.performance['2-1'], { attempts: 2, failures: 1 });
  assert.equal(migrated.lessonDone[0], true);
  assert.deepEqual(migrated.activityDates, ['2026-09-20']);
  assert.deepEqual(legacy, snapshot);
});

test('current store data is not unnecessarily reset', () => {
  const current = {
    done: { '0-5': 200 },
    hints: { '0-5': 3 },
    lessonDone: {},
    performance: { '0-5': { attempts: 3, failures: 1 } },
    activityDates: [],
    progressVersion: storeMigration.CURRENT_PROGRESS_VERSION,
  };

  const migrated = storeMigration.migrateStore(current);

  assert.equal(migrated.done['0-5'], 200);
  assert.equal(migrated.hints['0-5'], 3);
  assert.deepEqual(migrated.performance['0-5'], { attempts: 3, failures: 1 });
});

test('empty or partial store data receives safe defaults', () => {
  assert.deepEqual(
    storeMigration.migrateStore(null),
    storeMigration.createEmptyStore(),
  );

  const migrated = storeMigration.migrateStore({
    done: { '0-0': 100 },
  });

  assert.equal(migrated.done['0-0'], 100);
  assert.deepEqual(migrated.hints, {});
  assert.deepEqual(migrated.lessonDone, {});
  assert.deepEqual(migrated.performance, {});
  assert.deepEqual(migrated.activityDates, []);
  assert.equal(migrated.progressVersion, storeMigration.CURRENT_PROGRESS_VERSION);
});

test('structured equality ignores object key order but preserves array order', () => {
  assert.equal(valueEquality.areValuesEqual(10, 10), true);
  assert.equal(valueEquality.areValuesEqual(Number.NaN, Number.NaN), true);
  assert.equal(valueEquality.areValuesEqual([1, 2], [1, 2]), true);
  assert.equal(valueEquality.areValuesEqual([1, 2], [2, 1]), false);
  assert.equal(
    valueEquality.areValuesEqual(
      { nome: 'Ana', idade: 20, dados: { ativo: true, pontos: [1, 2] } },
      { dados: { pontos: [1, 2], ativo: true }, idade: 20, nome: 'Ana' },
    ),
    true,
  );
  assert.equal(
    valueEquality.areValuesEqual(
      { nome: 'Ana' },
      { nome: 'Ana', idade: 20 },
    ),
    false,
  );
});

test('next mission points to the first unfinished exercise', () => {
  const store = storeMigration.createEmptyStore();

  assert.equal(missionTargets.getNextExerciseIndex(0, store), 0);

  store.done['0-0'] = 100;
  store.done['0-1'] = 100;

  assert.equal(missionTargets.getNextExerciseIndex(0, store), 2);

  for (let index = 0; index < 10; index += 1) {
    store.done[`0-${index}`] = 100;
  }

  assert.equal(missionTargets.getNextExerciseIndex(0, store), 9);
});

test('concept review target respects exercise unlock rules', () => {
  const concept = {
    id: 'objectDeletion',
    state: 'developing',
  };

  const store = storeMigration.createEmptyStore();

  const target = missionTargets.findConceptMissionTarget(
    concept,
    store,
    (levelIndex, exerciseIndex) => levelIndex === 6 && exerciseIndex === 4,
  );

  assert.ok(target);
  assert.equal(target.levelIndex, 6);
  assert.equal(target.exerciseIndex, 4);
  assert.equal(target.exercise.title, 'Remover uma propriedade');

  const blocked = missionTargets.findConceptMissionTarget(
    concept,
    store,
    () => false,
  );

  assert.equal(blocked, null);
});

test('app route parser handles static, lesson, mission and completion URLs', () => {
  assert.deepEqual(router.parseAppRoute('/'), {
    view: 'dashboard',
    pathname: '/',
  });

  assert.deepEqual(router.parseAppRoute('/jornada/'), {
    view: 'map',
    pathname: '/jornada',
  });

  assert.deepEqual(router.parseAppRoute('/nivel/n7/aula'), {
    view: 'lesson',
    pathname: '/nivel/n7/aula',
    levelIndex: 6,
  });

  assert.deepEqual(router.parseAppRoute('/nivel/n7/desafio/10'), {
    view: 'mission',
    pathname: '/nivel/n7/desafio/10',
    levelIndex: 6,
    exerciseIndex: 9,
  });

  assert.deepEqual(router.parseAppRoute('/nivel/n7/concluido'), {
    view: 'completion',
    pathname: '/nivel/n7/concluido',
    levelIndex: 6,
  });
});

test('invalid routes fall back to dashboard', () => {
  assert.deepEqual(router.parseAppRoute('/nivel/n0'), {
    view: 'dashboard',
    pathname: '/',
  });

  assert.deepEqual(router.parseAppRoute('/nivel/n2/desafio/0'), {
    view: 'dashboard',
    pathname: '/',
  });

  assert.deepEqual(router.parseAppRoute('/qualquer-coisa'), {
    view: 'dashboard',
    pathname: '/',
  });
});

test('route builders generate canonical CodeMpi URLs', () => {
  assert.equal(router.getViewPath('dashboard'), '/');
  assert.equal(router.getViewPath('map'), '/jornada');
  assert.equal(router.getViewPath('search'), '/buscar');
  assert.equal(router.getViewPath('memory'), '/memoria');
  assert.equal(router.getViewPath('settings'), '/configuracoes');
  assert.equal(router.getLevelPath(6), '/nivel/n7');
  assert.equal(router.getLessonPath(6), '/nivel/n7/aula');
  assert.equal(router.getMissionPath(6, 9), '/nivel/n7/desafio/10');
  assert.equal(router.getCompletionPath(6), '/nivel/n7/concluido');
});


test('local identity is created once and remains stable', () => {
  const data = new Map();

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const first = userRepository.ensureLocalIdentity({
    persistence,
    now: () => '2026-09-24T18:00:00.000Z',
    createId: () => 'local_test-user',
  });

  const second = userRepository.ensureLocalIdentity({
    persistence,
    now: () => '2026-09-25T18:00:00.000Z',
    createId: () => 'local_should-not-be-used',
  });

  assert.deepEqual(first, second);
  assert.equal(first.user.id, 'local_test-user');
  assert.equal(first.user.kind, 'local');
  assert.equal(first.session.userId, first.user.id);
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.user).id,
    'local_test-user',
  );
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.session).userId,
    'local_test-user',
  );
});

test('local identity repairs an invalid session without replacing the user', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.user, {
      id: 'local_existing',
      kind: 'local',
      createdAt: '2026-09-20T12:00:00.000Z',
    }],
    [persistenceModule.STORAGE_KEYS.session, {
      userId: 'other_user',
      kind: 'local',
      startedAt: 'invalid-date',
    }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const identity = userRepository.ensureLocalIdentity({
    persistence,
    now: () => '2026-09-24T18:05:00.000Z',
    createId: () => 'local_new-user',
  });

  assert.equal(identity.user.id, 'local_existing');
  assert.equal(identity.user.createdAt, '2026-09-20T12:00:00.000Z');
  assert.equal(identity.session.userId, 'local_existing');
  assert.equal(identity.session.startedAt, '2026-09-24T18:05:00.000Z');
});

test('corrupted local user data creates a fresh safe identity', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.user, {
      id: '',
      kind: 'local',
      createdAt: 'not-a-date',
    }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const identity = userRepository.ensureLocalIdentity({
    persistence,
    now: () => '2026-09-24T18:10:00.000Z',
    createId: () => 'local_recovered',
  });

  assert.equal(identity.user.id, 'local_recovered');
  assert.equal(identity.user.createdAt, '2026-09-24T18:10:00.000Z');
  assert.equal(identity.session.userId, 'local_recovered');
});


test('progress repository loads migrated data and saves through the adapter', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.progress, {
      done: { '0-5': 200, '2-1': 300 },
      hints: { '0-5': 2 },
      lessonDone: {},
      performance: {},
      activityDates: [],
      progressVersion: 1,
    }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = progressRepositoryModule.createProgressRepository(persistence);
  const loaded = repository.load();

  assert.equal(loaded.progressVersion, storeMigration.CURRENT_PROGRESS_VERSION);
  assert.equal(loaded.done['0-5'], undefined);
  assert.equal(loaded.done['2-1'], 300);

  loaded.done['6-9'] = 550;
  assert.equal(repository.save(loaded), true);
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.progress).done['6-9'],
    550,
  );
});

test('preferences repository normalizes corrupted values and preserves valid choices', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.preferences, {
      interfaceScale: 'invalid',
      reduceMotion: 1,
      highContrast: 0,
      editorFontSize: 'large',
      editorLineWrapping: false,
      editorLineNumbers: false,
      editorIndentSize: 99,
      showXp: false,
      confirmReset: false,
    }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = preferencesRepositoryModule.createPreferencesRepository(persistence);
  const loaded = repository.load();

  assert.equal(loaded.interfaceScale, 'comfortable');
  assert.equal(loaded.reduceMotion, true);
  assert.equal(loaded.highContrast, false);
  assert.equal(loaded.editorFontSize, 'large');
  assert.equal(loaded.editorLineWrapping, false);
  assert.equal(loaded.editorLineNumbers, false);
  assert.equal(loaded.editorIndentSize, 2);
  assert.equal(loaded.showXp, false);
  assert.equal(loaded.confirmReset, false);

  loaded.interfaceScale = 'compact';
  assert.equal(repository.save(loaded), true);
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.preferences).interfaceScale,
    'compact',
  );
});

test('theme repository validates stored themes and saves through the adapter', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.settings, { theme: 'unknown-theme' }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = themeRepositoryModule.createThemeRepository(persistence);

  assert.equal(repository.load(), 'green');
  assert.equal(repository.save('violet'), true);
  assert.deepEqual(
    data.get(persistenceModule.STORAGE_KEYS.settings),
    { theme: 'violet' },
  );
  assert.equal(repository.load(), 'violet');
});


test('code executor reports syntax errors before running tests', async () => {
  const result = await codeExecutorModule.browserCodeExecutor.runTests(
    'function somar(a, b) { return a + ; }',
    'somar',
    [{ args: [1, 2], exp: 3 }],
  );

  assert.equal(result.status, 'compile-error');
  assert.equal(result.passed, 0);
  assert.equal(result.total, 1);
});

test('code executor reports a missing expected function', async () => {
  const result = await codeExecutorModule.browserCodeExecutor.runTests(
    'function outra() { return 1; }',
    'somar',
    [{ args: [1, 2], exp: 3 }],
  );

  assert.equal(result.status, 'missing-function');
  assert.equal(result.passed, 0);
  assert.equal(result.total, 1);
});

test('code executor captures runtime errors without stopping the suite', async () => {
  const result = await codeExecutorModule.browserCodeExecutor.runTests(
    'function executar(valor) { if (valor === 2) throw new Error("falhou"); return valor; }',
    'executar',
    [
      { args: [1], exp: 1 },
      { args: [2], exp: 2 },
      { args: [3], exp: 3 },
    ],
  );

  assert.equal(result.status, 'completed');
  assert.equal(result.passed, 2);
  assert.equal(result.total, 3);
  assert.equal(result.cases[0].passed, true);
  assert.equal(result.cases[1].passed, false);
  assert.match(result.cases[1].error, /falhou/);
  assert.equal(result.cases[2].passed, true);
});

test('code executor isolates mutable test arguments', async () => {
  const original = { estoque: 5, vendas: 0 };
  const tests = [
    {
      args: [original, 2],
      exp: { estoque: 3, vendas: 2 },
    },
  ];

  const result = await codeExecutorModule.browserCodeExecutor.runTests(
    'function vender(produto, quantidade) { produto.estoque -= quantidade; produto.vendas += quantidade; return produto; }',
    'vender',
    tests,
  );

  assert.equal(result.status, 'completed');
  assert.equal(result.passed, 1);
  assert.deepEqual(original, { estoque: 5, vendas: 0 });
});

test('free execution returns values and runtime errors through the executor', async () => {
  const success = await codeExecutorModule.browserCodeExecutor.runFunction(
    'function dobro(n) { return n * 2; }',
    'dobro',
    [6],
  );

  assert.deepEqual(success, {
    status: 'success',
    value: 12,
  });

  const failure = await codeExecutorModule.browserCodeExecutor.runFunction(
    'function falhar() { throw new Error("erro livre"); }',
    'falhar',
    [],
  );

  assert.equal(failure.status, 'runtime-error');
  assert.match(failure.error, /erro livre/);
});



test('execution policy accepts normal exercise code', () => {
  assert.deepEqual(
    executionPolicyModule.validateExecutionPolicy(
      'function somar(a, b) { return a + b; }',
    ),
    { ok: true },
  );
});

test('execution policy ignores blocked words inside comments and strings', () => {
  assert.deepEqual(
    executionPolicyModule.validateExecutionPolicy(
      [
        'function explicar() {',
        '  // fetch não deve ser executado aqui',
        '  const texto = "window fetch WebSocket";',
        '  return texto.length;',
        '}',
      ].join('\n'),
    ),
    { ok: true },
  );
});

test('execution policy blocks direct browser and network APIs', () => {
  const result = executionPolicyModule.validateExecutionPolicy(
    'function carregar() { return fetch("/dados"); }',
  );

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'blocked-api');
  assert.match(result.error, /fetch/);
});

test('execution policy blocks dynamic import', () => {
  const result = executionPolicyModule.validateExecutionPolicy(
    'function carregar() { return import("./outro.js"); }',
  );

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'dynamic-import');
});

test('execution policy limits oversized source code', () => {
  const result = executionPolicyModule.validateExecutionPolicy(
    'a'.repeat(executionPolicyModule.MAX_USER_CODE_LENGTH + 1),
  );

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'code-too-large');
});

test('code executor exposes policy violations without running tests', async () => {
  const result = await codeExecutorModule.browserCodeExecutor.runTests(
    'function buscar() { return fetch("/api"); }',
    'buscar',
    [{ args: [], exp: true }],
  );

  assert.equal(result.status, 'policy-error');
  assert.equal(result.passed, 0);
  assert.equal(result.total, 1);
  assert.match(result.error, /fetch/);
});

test('runtime shadowing blocks a sensitive global missed inside a template expression', async () => {
  const result = await codeExecutorModule.browserCodeExecutor.runFunction(
    'function tentar() { return `${fetch("/api")}`; }',
    'tentar',
    [],
  );

  assert.equal(result.status, 'runtime-error');
  assert.match(result.error, /fetch/i);
});

test('worker executor returns worker results and terminates the worker', async () => {
  let worker;

  const executor = workerExecutorModule.createWorkerCodeExecutor({
    timeoutMs: 100,
    workerFactory: () => {
      worker = {
        onmessage: null,
        onerror: null,
        terminated: false,
        postMessage(request) {
          queueMicrotask(() => {
            worker.onmessage?.({
              data: request.kind === 'tests'
                ? {
                    kind: 'tests',
                    result: {
                      status: 'completed',
                      passed: request.tests.length,
                      total: request.tests.length,
                      cases: request.tests.map((testCase, index) => ({
                        index,
                        args: testCase.args,
                        expected: testCase.exp,
                        result: testCase.exp,
                        passed: true,
                      })),
                    },
                  }
                : {
                    kind: 'function',
                    result: {
                      status: 'success',
                      value: 42,
                    },
                  },
            });
          });
        },
        terminate() {
          this.terminated = true;
        },
      };

      return worker;
    },
  });

  const result = await executor.runFunction(
    'function resposta() { return 42; }',
    'resposta',
    [],
  );

  assert.deepEqual(result, {
    status: 'success',
    value: 42,
  });
  assert.equal(worker.terminated, true);
});

test('worker executor interrupts an execution that exceeds the timeout', async () => {
  let worker;

  const executor = workerExecutorModule.createWorkerCodeExecutor({
    timeoutMs: 5,
    workerFactory: () => {
      worker = {
        onmessage: null,
        onerror: null,
        terminated: false,
        postMessage() {
          // Simula um código que nunca devolve resposta.
        },
        terminate() {
          this.terminated = true;
        },
      };

      return worker;
    },
  });

  const result = await executor.runTests(
    'function travar() { while (true) {} }',
    'travar',
    [{ args: [], exp: true }],
  );

  assert.equal(result.status, 'timeout');
  assert.match(result.error, /demorou demais/i);
  assert.equal(result.passed, 0);
  assert.equal(result.total, 1);
  assert.equal(worker.terminated, true);
});


test('api client normalizes URLs and sends JSON with bearer token', async () => {
  let requestUrl;
  let requestOptions;

  const client = apiClientModule.createApiClient({
    baseUrl: 'https://api.codempi.test/',
    fetchImpl: async (url, options) => {
      requestUrl = url;
      requestOptions = options;

      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    },
  });

  const result = await client.request('/sync/bootstrap', {
    method: 'POST',
    accessToken: 'token-123',
    body: { hello: 'world' },
  });

  assert.equal(requestUrl, 'https://api.codempi.test/sync/bootstrap');
  assert.equal(requestOptions.method, 'POST');
  assert.equal(requestOptions.headers.Authorization, 'Bearer token-123');
  assert.equal(requestOptions.headers['Content-Type'], 'application/json');
  assert.equal(requestOptions.body, JSON.stringify({ hello: 'world' }));
  assert.deepEqual(result, { ok: true });
});

test('api client exposes API errors with status and payload', async () => {
  const client = apiClientModule.createApiClient({
    baseUrl: 'https://api.codempi.test',
    fetchImpl: async () => new Response(
      JSON.stringify({ message: 'Sessão expirada.' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      },
    ),
  });

  await assert.rejects(
    () => client.request('/me'),
    (error) => {
      assert.equal(error.name, 'ApiError');
      assert.equal(error.status, 401);
      assert.equal(error.message, 'Sessão expirada.');
      assert.deepEqual(error.payload, { message: 'Sessão expirada.' });
      return true;
    },
  );
});

test('auth repository maps authentication operations to API endpoints', async () => {
  const calls = [];

  const api = {
    async request(path, options = {}) {
      calls.push({ path, options });

      if (path === 'auth/sign-in') {
        return {
          user: {
            id: 'cloud_1',
            kind: 'cloud',
            email: 'teste@codempi.dev',
            createdAt: '2026-09-24T19:00:00.000Z',
          },
          session: {
            userId: 'cloud_1',
            kind: 'cloud',
            accessToken: 'access-token',
            expiresAt: '2026-09-24T20:00:00.000Z',
          },
        };
      }

      if (path === 'me') {
        return {
          id: 'cloud_1',
          kind: 'cloud',
          email: 'teste@codempi.dev',
          createdAt: '2026-09-24T19:00:00.000Z',
        };
      }

      return undefined;
    },
  };

  const repository = authRepositoryModule.createAuthRepository(api);
  const auth = await repository.signIn({
    email: 'teste@codempi.dev',
    password: 'senha-segura',
  });

  await repository.getCurrentUser(auth.session.accessToken);
  await repository.signOut(auth.session.accessToken);

  assert.deepEqual(calls, [
    {
      path: 'auth/sign-in',
      options: {
        method: 'POST',
        body: {
          email: 'teste@codempi.dev',
          password: 'senha-segura',
        },
      },
    },
    {
      path: 'me',
      options: {
        accessToken: 'access-token',
      },
    },
    {
      path: 'auth/sign-out',
      options: {
        method: 'POST',
        accessToken: 'access-token',
      },
    },
  ]);
});

test('sync repository keeps bootstrap and snapshot operations separated', async () => {
  const calls = [];
  const cloudSnapshot = {
    version: cloudDomainModule.CLOUD_SNAPSHOT_VERSION,
    userId: 'cloud_1',
    progress: storeMigration.createEmptyStore(),
    preferences: preferencesRepositoryModule.createPreferencesRepository({
      read: () => null,
      write: () => true,
      remove: () => true,
    }).load(),
    theme: 'green',
    updatedAt: '2026-09-24T19:10:00.000Z',
  };

  const api = {
    async request(path, options = {}) {
      calls.push({ path, options });
      return cloudSnapshot;
    },
  };

  const repository = syncRepositoryModule.createSyncRepository(api);
  const bootstrap = {
    version: cloudDomainModule.CLOUD_SNAPSHOT_VERSION,
    sourceLocalUserId: 'local_1',
    progress: storeMigration.createEmptyStore(),
    preferences: cloudSnapshot.preferences,
    theme: 'green',
    exportedAt: '2026-09-24T19:05:00.000Z',
  };

  await repository.bootstrapLocalProfile('token', bootstrap);
  await repository.downloadSnapshot('token');
  await repository.uploadSnapshot('token', cloudSnapshot);

  assert.deepEqual(calls, [
    {
      path: 'sync/bootstrap',
      options: {
        method: 'POST',
        accessToken: 'token',
        body: bootstrap,
      },
    },
    {
      path: 'sync/snapshot',
      options: {
        accessToken: 'token',
      },
    },
    {
      path: 'sync/snapshot',
      options: {
        method: 'PUT',
        accessToken: 'token',
        body: cloudSnapshot,
      },
    },
  ]);
});

test('local to cloud bootstrap clones current local data without mutating it', () => {
  const identity = {
    user: {
      id: 'local_original',
      kind: 'local',
      createdAt: '2026-09-20T12:00:00.000Z',
    },
    session: {
      userId: 'local_original',
      kind: 'local',
      startedAt: '2026-09-24T18:00:00.000Z',
    },
  };

  const progressData = storeMigration.createEmptyStore();
  progressData.done['6-9'] = 550;

  const preferences = preferencesRepositoryModule.createPreferencesRepository({
    read: () => null,
    write: () => true,
    remove: () => true,
  }).load();

  preferences.interfaceScale = 'large';

  const payload = cloudMigrationModule.createLocalToCloudBootstrapPayload({
    identity,
    progress: progressData,
    preferences,
    theme: 'violet',
    now: () => '2026-09-24T19:15:00.000Z',
  });

  assert.equal(payload.version, cloudDomainModule.CLOUD_SNAPSHOT_VERSION);
  assert.equal(payload.sourceLocalUserId, 'local_original');
  assert.equal(payload.progress.done['6-9'], 550);
  assert.equal(payload.preferences.interfaceScale, 'large');
  assert.equal(payload.theme, 'violet');
  assert.equal(payload.exportedAt, '2026-09-24T19:15:00.000Z');

  payload.progress.done['6-9'] = 1;
  payload.preferences.interfaceScale = 'compact';

  assert.equal(progressData.done['6-9'], 550);
  assert.equal(preferences.interfaceScale, 'large');
});


test('cloud config stays disabled unless explicitly enabled with a valid API URL', () => {
  assert.deepEqual(
    cloudConfigModule.readCloudConfig({}),
    {
      enabled: false,
      apiBaseUrl: null,
    },
  );

  assert.deepEqual(
    cloudConfigModule.readCloudConfig({
      VITE_CODEMPI_CLOUD_ENABLED: 'true',
      VITE_CODEMPI_API_URL: 'invalid-url',
    }),
    {
      enabled: false,
      apiBaseUrl: null,
    },
  );

  assert.deepEqual(
    cloudConfigModule.readCloudConfig({
      VITE_CODEMPI_CLOUD_ENABLED: 'true',
      VITE_CODEMPI_API_URL: 'https://api.codempi.dev/',
    }),
    {
      enabled: true,
      apiBaseUrl: 'https://api.codempi.dev',
    },
  );
});

test('cloud services are only composed when cloud is enabled', () => {
  assert.equal(
    cloudServicesModule.createCloudServices({
      enabled: false,
      apiBaseUrl: 'https://api.codempi.dev',
    }),
    null,
  );

  const services = cloudServicesModule.createCloudServices({
    enabled: true,
    apiBaseUrl: 'https://api.codempi.dev',
  });

  assert.ok(services);
  assert.equal(typeof services.api.request, 'function');
  assert.equal(typeof services.auth.signIn, 'function');
  assert.equal(typeof services.sync.downloadSnapshot, 'function');
  assert.equal(typeof services.session.load, 'function');
});

test('cloud session repository persists a valid authenticated identity', () => {
  const data = new Map();

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = cloudSessionRepositoryModule.createCloudSessionRepository({
    persistence,
    now: () => Date.parse('2026-09-24T19:00:00.000Z'),
  });

  const identity = {
    user: {
      id: 'cloud_1',
      kind: 'cloud',
      email: 'aluno@codempi.dev',
      displayName: 'Aluno',
      createdAt: '2026-09-24T18:00:00.000Z',
    },
    session: {
      userId: 'cloud_1',
      kind: 'cloud',
      accessToken: 'access-token',
      expiresAt: '2026-09-24T20:00:00.000Z',
    },
  };

  assert.equal(repository.save(identity), true);
  assert.deepEqual(repository.load(), identity);
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.cloudUser).id,
    'cloud_1',
  );
  assert.equal(
    data.get(persistenceModule.STORAGE_KEYS.cloudSession).accessToken,
    'access-token',
  );
});

test('cloud session repository clears expired sessions automatically', () => {
  const data = new Map([
    [persistenceModule.STORAGE_KEYS.cloudUser, {
      id: 'cloud_1',
      kind: 'cloud',
      email: 'aluno@codempi.dev',
      createdAt: '2026-09-24T18:00:00.000Z',
    }],
    [persistenceModule.STORAGE_KEYS.cloudSession, {
      userId: 'cloud_1',
      kind: 'cloud',
      accessToken: 'expired-token',
      expiresAt: '2026-09-24T18:30:00.000Z',
    }],
  ]);

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = cloudSessionRepositoryModule.createCloudSessionRepository({
    persistence,
    now: () => Date.parse('2026-09-24T19:00:00.000Z'),
  });

  assert.equal(repository.load(), null);
  assert.equal(data.has(persistenceModule.STORAGE_KEYS.cloudUser), false);
  assert.equal(data.has(persistenceModule.STORAGE_KEYS.cloudSession), false);
});

test('cloud session repository rejects mismatched user and session IDs', () => {
  const data = new Map();

  const persistence = {
    read(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    write(key, value) {
      data.set(key, structuredClone(value));
      return true;
    },
    remove(key) {
      return data.delete(key);
    },
  };

  const repository = cloudSessionRepositoryModule.createCloudSessionRepository({
    persistence,
    now: () => Date.parse('2026-09-24T19:00:00.000Z'),
  });

  const saved = repository.save({
    user: {
      id: 'cloud_1',
      kind: 'cloud',
      email: 'aluno@codempi.dev',
      createdAt: '2026-09-24T18:00:00.000Z',
    },
    session: {
      userId: 'cloud_2',
      kind: 'cloud',
      accessToken: 'access-token',
      expiresAt: '2026-09-24T20:00:00.000Z',
    },
  });

  assert.equal(saved, false);
  assert.equal(data.size, 0);
});


test('backend config uses safe local defaults and validates invalid values', () => {
  assert.deepEqual(
    apiServerConfigModule.readApiConfig({}),
    {
      host: '127.0.0.1',
      port: 3001,
      webOrigin: 'http://localhost:5173',
      bodyLimitBytes: 65536,
      nodeEnv: 'development',
      databaseUrl: null,
    },
  );

  assert.throws(
    () => apiServerConfigModule.readApiConfig({
      CODEMPI_API_PORT: '70000',
    }),
    /CODEMPI_API_PORT/,
  );

  assert.throws(
    () => apiServerConfigModule.readApiConfig({
      CODEMPI_WEB_ORIGIN: 'file:///tmp/codempi',
    }),
    /CODEMPI_WEB_ORIGIN/,
  );
  assert.equal(
    apiServerConfigModule.readApiConfig({
      CODEMPI_DATABASE_URL: 'postgresql://user:pass@localhost:5432/codempi',
    }).databaseUrl,
    'postgresql://user:pass@localhost:5432/codempi',
  );

  assert.throws(
    () => apiServerConfigModule.readApiConfig({
      CODEMPI_DATABASE_URL: 'mysql://localhost/codempi',
    }),
    /CODEMPI_DATABASE_URL/,
  );

});

test('backend router exposes health and explicit unconfigured cloud endpoints', () => {
  const health = apiRouterModule.routeApiRequest({
    method: 'GET',
    pathname: '/health',
    requestId: 'req-health',
  });

  assert.equal(health.status, 200);
  assert.equal(health.body.status, 'ok');
  assert.equal(health.body.service, 'codempi-api');
  assert.equal(health.body.requestId, 'req-health');

  const auth = apiRouterModule.routeApiRequest({
    method: 'POST',
    pathname: '/auth/sign-in',
    requestId: 'req-auth',
    body: {
      email: 'aluno@codempi.dev',
      password: 'senha',
    },
  });

  assert.equal(auth.status, 501);
  assert.equal(auth.body.error.code, 'AUTH_NOT_CONFIGURED');

  const sync = apiRouterModule.routeApiRequest({
    method: 'GET',
    pathname: '/sync/snapshot',
    requestId: 'req-sync',
  });

  assert.equal(sync.status, 501);
  assert.equal(sync.body.error.code, 'SYNC_NOT_CONFIGURED');
});

test('backend router distinguishes method not allowed from unknown routes', () => {
  const methodNotAllowed = apiRouterModule.routeApiRequest({
    method: 'POST',
    pathname: '/health',
    requestId: 'req-method',
  });

  assert.equal(methodNotAllowed.status, 405);
  assert.equal(methodNotAllowed.headers.Allow, 'GET');
  assert.equal(
    methodNotAllowed.body.error.code,
    'METHOD_NOT_ALLOWED',
  );

  const notFound = apiRouterModule.routeApiRequest({
    method: 'GET',
    pathname: '/rota-inexistente',
    requestId: 'req-missing',
  });

  assert.equal(notFound.status, 404);
  assert.equal(notFound.body.error.code, 'NOT_FOUND');
});

test('backend HTTP server answers health and restricts browser origins', async () => {
  const config = {
    host: '127.0.0.1',
    port: 3001,
    webOrigin: 'http://localhost:5173',
    bodyLimitBytes: 65536,
    nodeEnv: 'test',
  };

  const server = apiServerModule.createApiServer(config);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, config.host, resolve);
  });

  const address = server.address();

  assert.ok(address && typeof address === 'object');

  const baseUrl = `http://${config.host}:${address.port}`;

  try {
    const allowed = await fetch(`${baseUrl}/health`, {
      headers: {
        Origin: config.webOrigin,
      },
    });

    assert.equal(allowed.status, 200);
    assert.equal(
      allowed.headers.get('access-control-allow-origin'),
      config.webOrigin,
    );
    assert.ok(allowed.headers.get('x-request-id'));

    const health = await allowed.json();
    assert.equal(health.status, 'ok');

    const blocked = await fetch(`${baseUrl}/health`, {
      headers: {
        Origin: 'https://outro-site.example',
      },
    });

    assert.equal(blocked.status, 403);

    const blockedPayload = await blocked.json();
    assert.equal(
      blockedPayload.error.code,
      'ORIGIN_NOT_ALLOWED',
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});

test('backend HTTP server validates JSON and request body size before routing', async () => {
  const config = {
    host: '127.0.0.1',
    port: 3001,
    webOrigin: 'http://localhost:5173',
    bodyLimitBytes: 32,
    nodeEnv: 'test',
  };

  const server = apiServerModule.createApiServer(config);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, config.host, resolve);
  });

  const address = server.address();

  assert.ok(address && typeof address === 'object');

  const baseUrl = `http://${config.host}:${address.port}`;

  try {
    const invalidJson = await fetch(`${baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{invalido',
    });

    assert.equal(invalidJson.status, 400);
    assert.equal(
      (await invalidJson.json()).error.code,
      'INVALID_JSON',
    );

    const tooLarge = await fetch(`${baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: 'x'.repeat(100),
      }),
    });

    assert.equal(tooLarge.status, 413);
    assert.equal(
      (await tooLarge.json()).error.code,
      'PAYLOAD_TOO_LARGE',
    );

    const stubbedAuth = await fetch(`${baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'a@b.c',
      }),
    });

    assert.equal(stubbedAuth.status, 501);
    assert.equal(
      (await stubbedAuth.json()).error.code,
      'AUTH_NOT_CONFIGURED',
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});


test('database schema defines users sessions snapshots and migration history', () => {
  const migration = databaseMigrationsModule.DATABASE_MIGRATIONS[0];

  assert.equal(migration.id, '001_initial_cloud_schema');
  assert.match(migration.sql, /CREATE TABLE IF NOT EXISTS codempi_users/);
  assert.match(migration.sql, /CREATE TABLE IF NOT EXISTS codempi_sessions/);
  assert.match(migration.sql, /CREATE TABLE IF NOT EXISTS codempi_progress_snapshots/);
  assert.match(migration.sql, /password_hash TEXT NOT NULL/);
  assert.match(migration.sql, /token_hash TEXT NOT NULL/);
  assert.match(migration.sql, /progress JSONB NOT NULL/);
  assert.match(migration.sql, /preferences JSONB NOT NULL/);
  assert.match(migration.sql, /revision BIGINT NOT NULL DEFAULT 1/);
  assert.match(migration.sql, /ON DELETE CASCADE/);
});

test('database migrations run pending migrations inside transactions', async () => {
  const calls = [];

  const database = {
    async query(sql, params = []) {
      calls.push({ sql, params });

      if (sql.startsWith('SELECT id FROM codempi_schema_migrations')) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      return {
        rows: [],
        rowCount: 0,
      };
    },
  };

  const executed = await databaseMigrationsModule.runDatabaseMigrations(database);

  assert.deepEqual(executed, ['001_initial_cloud_schema']);
  assert.equal(
    calls.some((call) => call.sql === 'BEGIN'),
    true,
  );
  assert.equal(
    calls.some((call) => call.sql === 'COMMIT'),
    true,
  );
  assert.equal(
    calls.some((call) => call.sql === 'ROLLBACK'),
    false,
  );

  const insert = calls.find((call) => (
    call.sql.startsWith('INSERT INTO codempi_schema_migrations')
  ));

  assert.deepEqual(
    insert.params,
    [
      '001_initial_cloud_schema',
      'Cria usuários, sessões e snapshots de progresso.',
    ],
  );
});

test('database migrations skip versions already recorded', async () => {
  const calls = [];

  const database = {
    async query(sql, params = []) {
      calls.push({ sql, params });

      if (sql.startsWith('SELECT id FROM codempi_schema_migrations')) {
        return {
          rows: [{ id: '001_initial_cloud_schema' }],
          rowCount: 1,
        };
      }

      return {
        rows: [],
        rowCount: 0,
      };
    },
  };

  const executed = await databaseMigrationsModule.runDatabaseMigrations(database);

  assert.deepEqual(executed, []);
  assert.equal(
    calls.some((call) => call.sql === 'BEGIN'),
    false,
  );
});

test('database migrations rollback when a migration fails', async () => {
  const calls = [];

  const database = {
    async query(sql, params = []) {
      calls.push({ sql, params });

      if (sql.startsWith('SELECT id FROM codempi_schema_migrations')) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      if (sql.includes('CREATE TABLE IF NOT EXISTS codempi_users')) {
        throw new Error('database failure');
      }

      return {
        rows: [],
        rowCount: 0,
      };
    },
  };

  await assert.rejects(
    () => databaseMigrationsModule.runDatabaseMigrations(database),
    /database failure/,
  );

  assert.equal(
    calls.some((call) => call.sql === 'ROLLBACK'),
    true,
  );
  assert.equal(
    calls.some((call) => call.sql === 'COMMIT'),
    false,
  );
});

test('N1-N7 curriculum keeps 70 exercises and 252 valid official test cases', async () => {
  const builtLevels = levelsModule.LEVELS.filter((level) => level.exercises?.length);

  assert.equal(builtLevels.length, 7);

  let exerciseCount = 0;
  let testCount = 0;

  for (const level of builtLevels) {
    assert.equal(level.exercises.length, 10);

    for (const exercise of level.exercises) {
      exerciseCount += 1;

      assert.equal(exercise.hints.length, 4);
      assert.ok(exercise.conceptIds?.length);

      const solution = exercise.hints[3];
      const execution = await codeExecutorModule.browserCodeExecutor.runTests(
        solution,
        exercise.fn,
        exercise.tests,
      );

      assert.equal(
        execution.status,
        'completed',
        `${level.tag} / ${exercise.title}: solução completa não compilou corretamente`,
      );

      assert.equal(
        execution.passed,
        exercise.tests.length,
        `${level.tag} / ${exercise.title}: solução oficial falhou em algum caso`,
      );

      testCount += exercise.tests.length;
    }
  }

  assert.equal(exerciseCount, 70);
  assert.equal(testCount, 252);
});
