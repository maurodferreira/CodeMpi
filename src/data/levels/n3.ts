import type { Level } from '../contentTypes';

export const N3_LEVEL: Level = {
  "name": "Loops",
  "tag": "N3",
  "exercises": [
    {
      "title": "Soma até N",
      "conceptIds": [
        "loops",
        "accumulators"
      ],
      "desc": "Retorne a soma de todos os números inteiros de 1 até n.",
      "sig": "function somaAte(n) { ... }",
      "starter": "function somaAte(n) {\n  let total = 0;\n\n  // some 1, 2, 3... até n\n}",
      "fn": "somaAte",
      "difficulty": "facil",
      "xp": 120,
      "skill": "usar um laço para acumular valores",
      "hints": [
        "Pense em como repetir uma operação para todos os números até n.",
        "Use um acumulador começando em 0 e um for de 1 até n.",
        "Crie o for com i começando em 1, avance enquanto i <= n e some cada i ao total.",
        "function somaAte(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            1
          ],
          "exp": 1
        },
        {
          "args": [
            5
          ],
          "exp": 15
        },
        {
          "args": [
            10
          ],
          "exp": 55
        },
        {
          "args": [
            0
          ],
          "exp": 0
        }
      ]
    },
    {
      "title": "Contando pares",
      "conceptIds": [
        "loops",
        "counters",
        "conditionals",
        "remainder"
      ],
      "desc": "Conte quantos números pares existem de 1 até n.",
      "sig": "function contarPares(n) { ... }",
      "starter": "function contarPares(n) {\n  let quantidade = 0;\n\n  // conte os números pares\n}",
      "fn": "contarPares",
      "difficulty": "facil",
      "xp": 120,
      "skill": "usar contador, laço e resto da divisão",
      "hints": [
        "Pense em uma variável que conte quantos pares foram encontrados.",
        "Percorra de 1 até n e aumente o contador quando i % 2 === 0.",
        "Faça o for de 1 até n e, dentro dele, use uma condição para incrementar quantidade apenas nos pares.",
        "function contarPares(n) {\n  let quantidade = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) quantidade++;\n  }\n\n  return quantidade;\n}"
      ],
      "tests": [
        {
          "args": [
            1
          ],
          "exp": 0
        },
        {
          "args": [
            6
          ],
          "exp": 3
        },
        {
          "args": [
            10
          ],
          "exp": 5
        }
      ]
    },
    {
      "title": "Soma dos múltiplos de 3",
      "conceptIds": [
        "loops",
        "accumulators",
        "conditionals",
        "remainder"
      ],
      "desc": "Retorne a soma dos números entre 1 e n que são múltiplos de 3.",
      "sig": "function somaMultiplosDe3(n) { ... }",
      "starter": "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  // encontre os múltiplos de 3\n}",
      "fn": "somaMultiplosDe3",
      "difficulty": "medio",
      "xp": 180,
      "skill": "combinar laço, condição e acumulador",
      "hints": [
        "Pense em como identificar números divisíveis por 3 durante uma repetição.",
        "Percorra de 1 até n e some apenas os valores cujo resto por 3 seja 0.",
        "Dentro do for, teste i % 3 === 0 e só então acrescente i ao acumulador.",
        "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0) total += i;\n  }\n\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            3
          ],
          "exp": 3
        },
        {
          "args": [
            10
          ],
          "exp": 18
        },
        {
          "args": [
            15
          ],
          "exp": 45
        }
      ]
    },
    {
      "title": "Soma dos ímpares",
      "conceptIds": [
        "loops",
        "accumulators",
        "conditionals",
        "remainder"
      ],
      "desc": "Retorne a soma de todos os números ímpares de 1 até n.",
      "sig": "function somaImpares(n) { ... }",
      "starter": "function somaImpares(n) {\n  let total = 0;\n\n  // some apenas os ímpares\n}",
      "fn": "somaImpares",
      "difficulty": "medio",
      "xp": 180,
      "skill": "filtrar valores dentro de um laço",
      "hints": [
        "Pense em como identificar um número que não é divisível por 2.",
        "Percorra de 1 até n e some os valores cujo resto por 2 seja diferente de 0.",
        "Dentro do for, identifique os ímpares com i % 2 !== 0 e acrescente apenas esses valores ao total.",
        "function somaImpares(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 !== 0) total += i;\n  }\n\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            5
          ],
          "exp": 9
        },
        {
          "args": [
            10
          ],
          "exp": 25
        },
        {
          "args": [
            1
          ],
          "exp": 1
        }
      ]
    },
    {
      "title": "Fatorial",
      "conceptIds": [
        "loops",
        "accumulators"
      ],
      "desc": "Retorne o fatorial de n. Considere que 0! = 1.",
      "sig": "function fatorial(n) { ... }",
      "starter": "function fatorial(n) {\n  let resultado = 1;\n\n  // multiplique pelos números de 1 até n\n}",
      "fn": "fatorial",
      "difficulty": "medio",
      "xp": 220,
      "skill": "usar acumulador para multiplicação",
      "hints": [
        "Pense em uma multiplicação que vai crescendo a cada volta.",
        "Comece o resultado em 1 e multiplique pelo contador de 1 até n.",
        "Use um acumulador iniciado em 1 e multiplique-o pelo contador a cada volta do for.",
        "function fatorial(n) {\n  let resultado = 1;\n\n  for (let i = 1; i <= n; i++) {\n    resultado *= i;\n  }\n\n  return resultado;\n}"
      ],
      "tests": [
        {
          "args": [
            0
          ],
          "exp": 1
        },
        {
          "args": [
            4
          ],
          "exp": 24
        },
        {
          "args": [
            6
          ],
          "exp": 720
        }
      ]
    },
    {
      "title": "Soma de uma lista",
      "conceptIds": [
        "loops",
        "accumulators",
        "iteration"
      ],
      "desc": "A lista já vem pronta. Percorra seus valores e retorne a soma de todos eles.",
      "sig": "function somarLista(valores) { ... }",
      "starter": "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista usando um índice\n}",
      "fn": "somarLista",
      "difficulty": "medio",
      "xp": 220,
      "skill": "percorrer uma lista com um laço",
      "hints": [
        "Pense em como visitar cada posição da lista e acumular os valores.",
        "Use um índice de 0 até antes de valores.length e some valores[i].",
        "Percorra os índices da lista de 0 até valores.length - 1 e acrescente cada valores[i] ao total.",
        "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            []
          ],
          "exp": 0
        },
        {
          "args": [
            [
              2,
              3,
              5
            ]
          ],
          "exp": 10
        },
        {
          "args": [
            [
              10,
              -2,
              4
            ]
          ],
          "exp": 12
        },
        {
          "args": [
            [
              7
            ]
          ],
          "exp": 7
        }
      ]
    },
    {
      "title": "Média da lista",
      "conceptIds": [
        "loops",
        "accumulators",
        "iteration",
        "division"
      ],
      "desc": "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.",
      "sig": "function mediaLista(valores) { ... }",
      "starter": "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}",
      "fn": "mediaLista",
      "difficulty": "dificil",
      "xp": 280,
      "skill": "combinar percurso, acumulador e divisão",
      "hints": [
        "Pense em como calcular uma média usando uma soma e uma quantidade.",
        "Some todos os valores e depois divida pelo tamanho da lista.",
        "Faça a mesma soma percorrendo a lista e, depois do laço, divida o total por valores.length.",
        "function mediaLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total / valores.length;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              2,
              4,
              6
            ]
          ],
          "exp": 4
        },
        {
          "args": [
            [
              10,
              20
            ]
          ],
          "exp": 15
        },
        {
          "args": [
            [
              5
            ]
          ],
          "exp": 5
        }
      ]
    },
    {
      "title": "Maior valor da lista",
      "conceptIds": [
        "loops",
        "iteration",
        "comparisons"
      ],
      "desc": "Percorra a lista e retorne o maior valor encontrado.",
      "sig": "function maiorValor(valores) { ... }",
      "starter": "function maiorValor(valores) {\n  let maior = valores[0];\n\n  // compare os próximos valores com maior\n}",
      "fn": "maiorValor",
      "difficulty": "dificil",
      "xp": 300,
      "skill": "percorrer valores e manter o maior encontrado",
      "hints": [
        "Pense em guardar o maior valor encontrado até cada momento.",
        "Comece com valores[0] e substitua maior sempre que encontrar um valor maior.",
        "Comece com valores[0] como maior e compare os próximos itens, substituindo o valor quando encontrar um maior.",
        "function maiorValor(valores) {\n  let maior = valores[0];\n\n  for (let i = 1; i < valores.length; i++) {\n    if (valores[i] > maior) maior = valores[i];\n  }\n\n  return maior;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              3,
              8,
              2
            ]
          ],
          "exp": 8
        },
        {
          "args": [
            [
              -5,
              -2,
              -9
            ]
          ],
          "exp": -2
        },
        {
          "args": [
            [
              10,
              10,
              4
            ]
          ],
          "exp": 10
        }
      ]
    },
    {
      "title": "Acima do limite",
      "conceptIds": [
        "loops",
        "counters",
        "iteration",
        "comparisons"
      ],
      "desc": "Conte quantos valores da lista são maiores que o limite informado.",
      "sig": "function contarAcima(valores, limite) { ... }",
      "starter": "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  // conte os valores maiores que limite\n}",
      "fn": "contarAcima",
      "difficulty": "dificil",
      "xp": 350,
      "skill": "combinar contador, comparação e percurso",
      "hints": [
        "Pense em contar apenas os valores que passam do limite.",
        "Percorra a lista, compare cada valor com limite e aumente quantidade quando for maior.",
        "Percorra a lista e incremente quantidade somente quando valores[i] for maior que limite.",
        "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] > limite) quantidade++;\n  }\n\n  return quantidade;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              2,
              5,
              8,
              1
            ],
            4
          ],
          "exp": 2
        },
        {
          "args": [
            [
              10,
              10,
              3
            ],
            10
          ],
          "exp": 0
        },
        {
          "args": [
            [
              -1,
              0,
              4
            ],
            -2
          ],
          "exp": 3
        }
      ]
    },
    {
      "title": "BOSS · Maior salto",
      "conceptIds": [
        "loops",
        "iteration",
        "comparisons",
        "accumulators"
      ],
      "desc": "Uma lista representa valores registrados em sequência. Retorne a maior diferença absoluta entre dois valores consecutivos. Com uma lista de um único item, retorne 0.",
      "sig": "function maiorSalto(valores) { ... }",
      "starter": "function maiorSalto(valores) {\n  let maior = 0;\n\n  // compare cada valor com o anterior\n}",
      "fn": "maiorSalto",
      "difficulty": "boss",
      "xp": 550,
      "skill": "combinar percurso, comparação e atualização de um melhor resultado",
      "hints": [
        "Pense em comparar cada valor com o valor que veio imediatamente antes.",
        "Calcule a diferença absoluta entre vizinhos e guarde apenas o maior salto encontrado.",
        "Comece em zero, compare cada item com o anterior usando Math.abs e atualize maior quando o salto for maior.",
        "function maiorSalto(valores) {\n  let maior = 0;\n\n  for (let i = 1; i < valores.length; i++) {\n    const salto = Math.abs(valores[i] - valores[i - 1]);\n    if (salto > maior) maior = salto;\n  }\n\n  return maior;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              10
            ]
          ],
          "exp": 0
        },
        {
          "args": [
            [
              10,
              4,
              12,
              7
            ]
          ],
          "exp": 8
        },
        {
          "args": [
            [
              -5,
              -1,
              -9
            ]
          ],
          "exp": 8
        }
      ]
    }
  ]
};
