# CodeMpi

CodeMpi é uma plataforma de aprendizado de programação focada em prática guiada, feedback e evolução individual.

A proposta é levar o aluno do básico ao pensamento algorítmico por meio de aulas, desafios progressivos, testes automáticos, diagnóstico de erros e ferramentas de experimentação.

## O que já existe

- aulas guiadas para os níveis iniciais;
- desafios progressivos com XP;
- multiplicador de XP por uso de dicas: 100%, 90%, 75%, 50% e 25% na solução completa;
- testes automáticos;
- diagnóstico educativo de erros;
- teste de mesa com entradas personalizadas;
- continuidade diária sem perda de progresso;
- memória de aprendizado com revisão rápida sem XP;
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
│   ├── LearningMemory.tsx
│   ├── LessonPage.tsx
│   ├── MissionPage.tsx
│   └── SettingsPage.tsx
├── data/
│   ├── concepts.ts
│   ├── conceptGuidance.ts
│   ├── conceptReviews.ts
│   ├── levels.ts
│   ├── lessons.ts
│   └── themes.ts
├── hooks/
│   ├── useLearningProgress.ts
│   ├── useMissionRunner.ts
│   ├── useProgressStore.ts
│   └── useTheme.ts
├── utils/
│   ├── learningFeedback.ts
│   ├── missionTargets.ts
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

## Conteúdo atual

- **N1 — Variáveis e Operadores:** disponível, com aula guiada e 10 desafios.
- **N2 — Condicionais:** disponível, com aula guiada e 10 desafios.
- **N3 — Loops:** disponível, com aula guiada e 10 desafios.
- **N4 a N10:** jornada estruturada, conteúdo ainda em construção.

## Sistema de aprendizagem

A progressão atual combina:

1. aula guiada antes do primeiro desafio de cada nível;
2. exercícios com testes automáticos;
3. feedback educativo baseado no primeiro caso que falhou;
4. diagnóstico por conceito, com foco e pergunta para pensar;
5. dicas progressivas sem bloquear a conclusão;
6. solução completa como último nível de ajuda, reduzindo o XP para 25%;
7. memória de aprendizado baseada em conclusão, tentativas e erros;
8. revisão rápida de conceito sem alterar XP ou progresso.

A primeira conclusão de um exercício registra o XP conquistado. Reabrir um exercício já concluído não concede XP novamente.

## Arquitetura

O `App.tsx` atua como orquestrador. As telas ficam em `components/`, o estado persistente e a execução da missão ficam em hooks, os dados pedagógicos ficam em `data/`, e regras reutilizáveis de progressão, seleção de missão, feedback e XP ficam separadas da UI.

A execução atual de JavaScript acontece no navegador para o protótipo. Antes de disponibilizar execução de código para usuários públicos, o executor deverá ser substituído por um ambiente sandbox seguro.
