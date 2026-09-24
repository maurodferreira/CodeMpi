import { N1_LEVEL } from './levels/n1';
import { N2_LEVEL } from './levels/n2';
import { N3_LEVEL } from './levels/n3';
import { N4_LEVEL } from './levels/n4';
import { N5_LEVEL } from './levels/n5';
import { N6_LEVEL } from './levels/n6';
import { N7_LEVEL } from './levels/n7';
import type { Level } from './contentTypes';

export type { Exercise, ExerciseTest, Level } from './contentTypes';

const ROADMAP_LEVELS: Level[] = [
  {
    "name": "Lógica Avançada",
    "tag": "N8",
    "exercises": null,
    "count": 10,
    "topics": "segundo maior, frequência, agrupamento, números repetidos, interseção, diferença, soma alvo, sequência, estatísticas, desafios combinados"
  },
  {
    "name": "Algoritmos",
    "tag": "N9",
    "exercises": null,
    "count": 10,
    "topics": "busca linear, busca binária, ordenação manual, maior sequência, contagem, frequência, mínimo/máximo, comparação, algoritmo combinado, otimização"
  },
  {
    "name": "Boss Final",
    "tag": "N10",
    "exercises": null,
    "count": 5,
    "topics": "inventário, ranking, sistema bancário, sistema de cadastro, mini jogo"
  }
];

export const LEVELS: Level[] = [
  N1_LEVEL,
  N2_LEVEL,
  N3_LEVEL,
  N4_LEVEL,
  N5_LEVEL,
  N6_LEVEL,
  N7_LEVEL,
  ...ROADMAP_LEVELS,
];
