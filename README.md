# CodeMpi

**Aprenda programação praticando, errando, entendendo e tentando de novo.**

CodeMpi é uma plataforma educacional de programação criada para levar uma pessoa do primeiro contato com código até problemas mais avançados de lógica e algoritmos.

A proposta não é ser apenas uma lista de exercícios. O produto combina aula guiada, prática progressiva, feedback imediato, revisão por conceito e acompanhamento individual da aprendizagem.

> **Versão atual: 0.7.0**  
> N1–N7 disponíveis · 70 desafios · 252 casos de teste · 55 conceitos acompanhados

---

## Visão do produto

O CodeMpi foi pensado em torno de um ciclo simples:

```text
aprender → praticar → errar → entender → tentar novamente → dominar
```

O erro faz parte da experiência. Em vez de apenas informar que uma resposta está errada, o sistema tenta mostrar onde a lógica divergiu e qual conceito merece atenção.

A experiência é **mobile-first**, mas também foi construída para funcionar bem no desktop.

### Princípios

- prática antes de memorização;
- dificuldade crescente sem saltos desnecessários;
- feedback que ajuda a pensar em vez de apenas entregar a resposta;
- XP pessoal, sem ranking competitivo;
- progresso nunca é apagado por perder uma sequência de dias;
- dicas ajudam sem bloquear a conclusão;
- solução completa existe como último recurso;
- interface enxuta: elementos visuais precisam ter função no aprendizado.

---

## Estado atual

### Conteúdo disponível

| Nível | Tema | Desafios | Status |
| --- | --- | ---: | --- |
| N1 | Variáveis e Operadores | 10 | ✅ Disponível |
| N2 | Condicionais | 10 | ✅ Disponível |
| N3 | Loops | 10 | ✅ Disponível |
| N4 | Strings | 10 | ✅ Disponível |
| N5 | Arrays | 10 | ✅ Disponível |
| N6 | Funções e Lógica | 10 | ✅ Disponível |
| N7 | Objetos | 10 | ✅ Disponível |
| N8 | Lógica Avançada | 10 planejados | 🚧 Planejado |
| N9 | Algoritmos | 10 planejados | 🚧 Planejado |
| N10 | Boss Final | 5 planejados | 🚧 Planejado |

Hoje o CodeMpi possui:

- **70 desafios implementados**;
- **252 casos de teste** cadastrados;
- **7 aulas guiadas**;
- **55 conceitos** acompanhados pela memória de aprendizado;
- revisão rápida e feedback pedagógico específico para todos os conceitos atuais.

---

## O que já funciona

### Aprendizado

- aulas guiadas antes da prática;
- exercícios progressivos por nível;
- testes automáticos;
- feedback baseado no primeiro caso que falhou;
- diagnóstico por conceito;
- dicas progressivas;
- solução completa como última ajuda;
- revisão rápida de conceitos sem XP;
- memória de aprendizado;
- busca por nível, conceito e desafio;
- tela de conclusão de nível;
- continuidade diária e melhor sequência;
- mapa completo da jornada.

### Editor e prática

- editor baseado em CodeMirror;
- JavaScript com syntax highlighting;
- números de linha configuráveis;
- quebra de linha configurável;
- tamanho de fonte configurável;
- indentação de 2 ou 4 espaços;
- atalhos de código para mobile;
- modo foco no desktop;
- teste livre com entradas personalizadas;
- reinício do código com confirmação opcional.

### Interface

- layout responsivo;
- experiência mobile-first;
- navegação específica para mobile;
- cinco temas visuais;
- escala da interface;
- opção de alto contraste;
- redução de animações;
- preferências persistidas no navegador.

---

## Sistema de XP e dicas

Cada desafio possui um XP base.

O XP recebido depende da quantidade de ajuda utilizada antes da primeira conclusão:

| Ajuda utilizada | XP recebido |
| --- | ---: |
| Nenhuma dica | 100% |
| 1 dica | 90% |
| 2 dicas | 75% |
| 3 dicas | 50% |
| Solução completa | 25% |

A primeira conclusão registra o XP conquistado.

Reabrir ou resolver novamente um exercício já concluído **não concede XP adicional**.

As aulas também possuem uma pequena recompensa própria.

---

## Memória de aprendizado

O CodeMpi não acompanha apenas quais exercícios foram concluídos. Ele também registra sinais de aprendizagem por conceito.

Cada conceito pode aparecer em um destes estados:

- **Ainda não praticado** — nenhum exercício relacionado foi tentado;
- **Em desenvolvimento** — já houve prática, mas o conceito ainda não está totalmente consolidado;
- **Vale revisar** — o histórico registra dificuldade recorrente;
- **Dominado** — todos os desafios relacionados ao conceito foram concluídos.

A memória considera:

- desafios relacionados;
- exercícios concluídos;
- número de tentativas;
- tentativas com erro;
- progresso daquele conceito.

Cada conceito atual também possui:

- orientação pedagógica específica;
- pergunta de reflexão;
- checkpoint de revisão rápida;
- ligação com exercícios relevantes da jornada.

Esses estados servem para **orientar a prática**, não para dar nota ao usuário.

---

## Progressão

A jornada é sequencial.

Um nível é liberado quando o nível anterior é concluído, e os exercícios de um nível são liberados progressivamente.

Atalhos como busca, memória e navegação respeitam as mesmas regras de desbloqueio.

Quando todo o conteúdo atualmente disponível é concluído, o progresso permanece registrado e a próxima etapa aparece como **Em breve**.

---

## Stack

### Frontend

- React 19
- TypeScript 6
- Vite 8
- CodeMirror 6
- CSS customizado

### Backend Foundation

- Node.js 22+
- TypeScript
- servidor HTTP nativo do Node
- configuração por ambiente
- CORS restrito à origem configurada
- limite de tamanho para bodies JSON
- request ID por requisição
- graceful shutdown

A fundação da API já existe e o runtime PostgreSQL usa `pg` com pool de conexões. O schema, migrations e repositories SQL de usuário, sessão e progresso já estão conectados à camada de banco. Autenticação e sincronização HTTP ainda não estão ativadas.


### Database Foundation

O schema inicial foi desenhado para PostgreSQL e inclui:

- `codempi_users`;
- `codempi_sessions`;
- `codempi_progress_snapshots`;
- `codempi_schema_migrations`.

Decisões importantes:

- e-mail armazenado normalizado em minúsculas;
- senha armazenada somente como `password_hash`;
- token de sessão armazenado somente como `token_hash`;
- relações com `ON DELETE CASCADE`;
- progresso e preferências em `JSONB`;
- `revision` no snapshot para preparar controle de conflitos de sincronização;
- migrations executadas dentro de transações com `COMMIT`/`ROLLBACK`.

Quando `CODEMPI_DATABASE_URL` é configurada, a API cria um pool PostgreSQL real. O endpoint `/health` informa apenas o estado do banco (`ok` ou `unavailable`) e nunca expõe a string de conexão.

As migrations são explícitas, não executadas escondidas no start da API:

```bash
npm run db:migrate
```

Os repositories PostgreSQL implementam:

- criação e busca de usuários;
- criação, consulta de sessão ativa e revogação;
- leitura e gravação do snapshot de progresso;
- controle otimista de concorrência via `revision`.

A CI sobe uma instância PostgreSQL descartável e executa testes de integração reais sobre migrations, usuários, sessões, snapshots, conflitos de revisão e `ON DELETE CASCADE`.

### Persistência atual

O CodeMpi continua **local-first**.

Hoje:

- progresso, preferências, tema e identidade local usam `localStorage`;
- a fundação de sessão cloud usa `sessionStorage`, para sobreviver a recarregamentos sem persistir o token indefinidamente;
- a cloud fica desligada por padrão;
- a Backend Foundation já existe e expõe uma API local real;
- autenticação, banco de dados, login visual e sincronização ativa ainda não estão implementados.

A sessão cloud já possui validação de usuário, token, expiração e vínculo entre IDs. Sessões inválidas ou expiradas são descartadas automaticamente.

> Quando a autenticação real for conectada, a estratégia final de segurança deve preferir sessão/refresh token protegido pelo servidor (por exemplo, cookie `HttpOnly` seguro) em vez de depender de credenciais de longa duração acessíveis pelo JavaScript.

---

## Arquitetura

O projeto foi organizado para separar interface, estado, regras e conteúdo pedagógico.

```text
src/
├── components/
│   ├── AppFooter.tsx
│   ├── AppHeader.tsx
│   ├── CodeEditor.tsx
│   ├── CompletionPage.tsx
│   ├── Dashboard.tsx
│   ├── JourneyMap.tsx
│   ├── LearningMemory.tsx
│   ├── LearningMemoryPage.tsx
│   ├── LessonPage.tsx
│   ├── MissionPage.tsx
│   ├── SearchPage.tsx
│   └── SettingsPage.tsx
│
├── data/
│   ├── levels/
│   │   ├── n1.ts
│   │   ├── n2.ts
│   │   ├── n3.ts
│   │   ├── n4.ts
│   │   ├── n5.ts
│   │   ├── n6.ts
│   │   └── n7.ts
│   │
│   ├── lessons/
│   │   ├── n1.ts
│   │   ├── n2.ts
│   │   ├── n3.ts
│   │   ├── n4.ts
│   │   ├── n5.ts
│   │   ├── n6.ts
│   │   └── n7.ts
│   │
│   ├── conceptGuidance.ts
│   ├── conceptReviews.ts
│   ├── concepts.ts
│   ├── contentTypes.ts
│   ├── levels.ts
│   ├── lessons.ts
│   └── themes.ts
│
├── hooks/
│   ├── useAppPreferences.ts
│   ├── useLearningProgress.ts
│   ├── useMissionRunner.ts
│   ├── useProgressStore.ts
│   └── useTheme.ts
│
├── utils/
│   ├── learningFeedback.ts
│   ├── missionTargets.ts
│   ├── progress.ts
│   └── xp.ts
│
├── styles/
│   └── dashboard-refinement.css
│
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

### Responsabilidades principais

**`App.tsx`**  
Orquestra as telas, o nível atual, navegação e integração entre os hooks.

**`data/levels/`**  
Contém os desafios, testes, dicas, XP e metadados de cada nível.

**`data/lessons/`**  
Contém as aulas guiadas de cada nível.

**`useProgressStore`**  
Persiste progresso, dicas, desempenho, aulas concluídas e atividade diária.

**`useLearningProgress`**  
Calcula desbloqueios, XP total, ponto de continuação e estado dos conceitos.

**`useMissionRunner`**  
Orquestra a experiência da missão, registra desempenho e delega a execução para o `CodeExecutor`.

**`LearningMemory`**  
Transforma o histórico de prática em uma visão de conceitos para revisar, desenvolver ou considerar dominados.

---

## Como executar

### Requisitos

- Node.js compatível com as dependências atuais;
- npm.

### Clonar

```bash
git clone https://github.com/maurodferreira/CodeMpi.git
cd CodeMpi
```

### Instalar dependências

```bash
npm install
```

### Ambiente de desenvolvimento

Frontend:

```bash
npm run dev
```

O Vite normalmente disponibiliza o projeto em:

```text
http://localhost:5173
```

Backend Foundation:

```bash
npm run api:start
```

Por padrão, a API sobe em:

```text
http://127.0.0.1:3001
```

Health check:

```text
GET http://127.0.0.1:3001/health
```

Enquanto autenticação e banco ainda não estão conectados, as rotas `/auth/*` e `/sync/*` respondem `501 Not Implemented` de forma explícita, em vez de simular uma conta funcional.

### Configuração da Cloud Foundation

A cloud permanece desligada por padrão. O arquivo `.env.example` documenta as variáveis disponíveis:

```env
VITE_CODEMPI_CLOUD_ENABLED=false
VITE_CODEMPI_API_URL=http://localhost:3001

CODEMPI_API_HOST=127.0.0.1
CODEMPI_API_PORT=3001
CODEMPI_WEB_ORIGIN=http://localhost:5173
CODEMPI_API_BODY_LIMIT=65536
CODEMPI_DATABASE_URL=
```

Para desenvolvimento futuro com uma API real, crie um arquivo `.env.local` e habilite explicitamente a integração:

```env
VITE_CODEMPI_CLOUD_ENABLED=true
VITE_CODEMPI_API_URL=http://localhost:3001
```

Se a flag não estiver como `true` ou a URL não for HTTP/HTTPS válida, os serviços cloud não são inicializados.

---

## Scripts

### Desenvolvimento

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Validação completa

```bash
npm run check
```

`npm run check` executa lint, testes automatizados e build em sequência.

### Preview do build

```bash
npm run preview
```

### Build da API

```bash
npm run api:build
```

### Iniciar a API local

```bash
npm run api:start
```

### Executar migrations PostgreSQL

```bash
npm run db:migrate
```

Requer `CODEMPI_DATABASE_URL` configurada.

### Testes de integração PostgreSQL

```bash
npm run test:postgres
```

Requer `CODEMPI_TEST_DATABASE_URL` apontando para um banco de teste descartável.

---

## Testes dos desafios

Cada exercício possui casos de teste declarados junto ao conteúdo.

Na v0.7.0 existem **252 casos de teste** distribuídos entre os 70 desafios.

Distribuição atual:

| Nível | Casos de teste |
| --- | ---: |
| N1 | 31 |
| N2 | 32 |
| N3 | 32 |
| N4 | 37 |
| N5 | 39 |
| N6 | 46 |
| N7 | 35 |
| **Total** | **252** |

As soluções completas cadastradas foram validadas contra todos esses casos.

O avaliador também clona os argumentos antes de executar cada teste, impedindo que exercícios que alteram arrays ou objetos contaminem execuções seguintes.

Arrays e objetos são comparados estruturalmente, sem depender da ordem de propriedades de um objeto.

---

## Execução de código

A execução JavaScript do usuário é isolada da interface principal por um **Web Worker**.

A camada atual inclui:

- contrato `CodeExecutor` desacoplado da UI;
- Web Worker dedicado por execução;
- timeout que encerra código que demora além do limite;
- clonagem dos argumentos de teste;
- política de tamanho máximo do código;
- bloqueio de APIs que não pertencem ao ambiente de exercícios, como rede, storage e criação de outros workers;
- shadowing de globais sensíveis como segunda barreira local.

Essa arquitetura evita que erros comuns — incluindo loops infinitos — congelem a interface e reduz o acesso acidental a recursos do navegador.

> **Limite de segurança:** Web Worker, timeout e bloqueio de APIs **não constituem um sandbox de segurança completo**. Código JavaScript executado no cliente continua no ambiente do navegador. Antes de permitir execução pública de código não confiável em escala, o executor deverá migrar para isolamento forte, como sandbox dedicado/processo isolado ou serviço remoto com limites próprios de CPU, memória e rede.

---

## Dados e privacidade na versão atual

O progresso atual fica salvo localmente no navegador.

Isso inclui:

- desafios concluídos;
- XP conquistado;
- dicas utilizadas;
- tentativas e erros;
- aulas concluídas;
- dias de atividade;
- preferências de interface;
- tema.

Consequências do modelo atual:

- trocar de navegador ou dispositivo não leva o progresso junto;
- limpar os dados do navegador pode remover o progresso;
- ainda não existe conta do usuário;
- ainda não existe recuperação de progresso na nuvem.

Esses pontos fazem parte da próxima fase do produto.

---

## Roadmap

### 0.7.x — Consolidação

- [x] N1–N7 completos
- [x] memória de aprendizado
- [x] revisão rápida por conceito
- [x] experiência mobile
- [x] modo foco
- [x] busca
- [x] arquitetura de conteúdo separada por nível
- [x] validação de 252 casos de teste
- [x] estabilização da progressão e desbloqueios

### Próxima fase — App Foundation

Objetivo: deixar de tratar o CodeMpi apenas como um frontend com conteúdo e preparar uma fundação real de aplicativo.

Planejado:

- roteamento de aplicação;
- camada de persistência desacoplada do LocalStorage;
- estrutura de usuário;
- preparação para PWA;
- funcionamento offline onde fizer sentido;
- estratégia segura para execução de código;
- melhoria da organização de estado;
- base para backend e sincronização.

### Fase Cloud

Em andamento:

- [x] contratos de autenticação e sincronização;
- [x] sessão cloud local temporária;
- [x] Backend Foundation;
- [x] schema PostgreSQL inicial;
- [x] migrations transacionais;
- [x] driver PostgreSQL conectado à API;
- [x] repositories SQL de usuário, sessão e progresso;
- [x] testes de integração PostgreSQL na CI;
- [ ] autenticação real;
- [ ] conta CodeMpi;
- [ ] progresso sincronizado;
- [ ] recuperação de progresso;
- [ ] uso em múltiplos dispositivos;
- [ ] perfil do usuário.

### Conteúdo futuro

**N8 — Lógica Avançada**  
Combinação de arrays, objetos, loops, funções e condicionais em problemas mais complexos.

**N9 — Algoritmos**  
Busca, ordenação, frequência, comparação de estratégias e introdução à eficiência.

**N10 — Boss Final**  
Problemas maiores que combinam diferentes conceitos da jornada em pequenos sistemas.

---

## O que o CodeMpi não quer ser

O objetivo não é transformar aprendizado em uma coleção de medalhas, rankings ou elementos decorativos.

XP existe para representar a própria evolução do usuário, não para competir com outras pessoas.

O foco é criar uma experiência em que a pessoa consiga perceber:

> “eu não sabia resolver isso antes; agora eu sei por quê funciona.”

---

## Status do projeto

O CodeMpi está em desenvolvimento ativo.

A versão **0.7.0** representa a consolidação da primeira grande base do produto:

```text
fundamentos
    ↓
condicionais
    ↓
loops
    ↓
strings
    ↓
arrays
    ↓
funções
    ↓
objetos
```

A próxima etapa deixa de ser apenas adicionar mais exercícios e passa a trabalhar também na **fundação do CodeMpi como aplicativo**.
