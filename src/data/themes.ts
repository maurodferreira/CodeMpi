import type { ThemeOption } from '../types';

export const THEMES: ThemeOption[] = [
  {
    id: 'green',
    name: 'Code Green',
    description: 'A identidade original do CodeMpi.',
    colors: ['#07110F', '#35E875', '#FFB84D'],
  },
  {
    id: 'carbon',
    name: 'Carbon',
    description: 'Preto quase absoluto e contraste limpo.',
    colors: ['#050505', '#FFFFFF', '#AAAAAA'],
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Roxo escuro com uma energia mais futurista.',
    colors: ['#0E0A16', '#8F5CFF', '#CFAAFF'],
  },
  {
    id: 'crimson',
    name: 'Crimson',
    description: 'Vermelho profundo com personalidade forte.',
    colors: ['#120809', '#FF404F', '#FFBE66'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Azul escuro, técnico e mais frio.',
    colors: ['#07101A', '#2E95FF', '#65B7FF'],
  },
];
