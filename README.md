# CodeMpi

CodeMpi é uma plataforma de aprendizado de programação focada em prática guiada, feedback e evolução individual.

A proposta é levar o aluno do básico ao pensamento algorítmico por meio de aulas, desafios progressivos, testes automáticos, diagnóstico de erros e ferramentas de experimentação.

## O que já existe

- aulas guiadas para os níveis iniciais;
- desafios progressivos com XP;
- multiplicador de XP por uso de dicas: 100%, 90%, 75% e 50%;
- testes automáticos;
- diagnóstico educativo de erros;
- teste de mesa com entradas personalizadas;
- continuidade diária sem perda de progresso;
- memória de aprendizado e revisão;
- mapa da jornada;
- tela de conclusão de nível;
- temas de interface personalizáveis.

## Stack

- React 19
- TypeScript
- Vite
- CodeMirror
- CSS customizado
- LocalStorage para persistência do progresso atual

## Estrutura

```
src/
├── components/
│   ├── AppHeader.tsx
│   ├── CompletionPage.tsx
│   ├── Dashboard.tsx
│   ├── JourneyMap.tsx
│   ├── LessonPage.tsx
│   ├── MissionPage.tsx
│   └── SettingsPage.tsx
├── data/
│   ├── concepts.ts
│   ├── levels.ts
│   ├── lessons.ts
│   └── themes.ts
├── hooks/
│   ├── useLearningProgress.ts
│   ├── useMissionRunner.ts
│   ├── useProgressStore.ts
│   └── useTheme.ts
├── utils/
│   ├── progress.ts
│   └── xp.ts
├── index.css
└── types.ts
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação local:

```bash
npm run build
npm run lint
```

## Conteúdo

- **N1 — Variáveis e Operadores:** disponível.
- **N2 — Condicionais:** disponível.
- **N3 a N10:** jornada estruturada, conteúdo ainda em construção.

## Arquitetura

O `App.tsx` atua como orquestrador. As telas ficam em `components/`, o estado persistente e a execução da missão ficam em hooks, e regras reutilizáveis de progressão e XP ficam separadas da UI.

A execução atual de JavaScript acontece no navegador para o protótipo. Antes de disponibilizar execução de código para usuários públicos, o executor deverá ser substituído por um ambiente sandbox seguro.
