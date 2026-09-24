import type { Level } from '../contentTypes';

export const N5_LEVEL: Level = {
  "name": "Arrays",
  "tag": "N5",
  "exercises": [
    {
      "title": "Primeiro elemento",
      "conceptIds": [
        "arrays",
        "arrayIndex"
      ],
      "desc": "Retorne o primeiro valor da lista.",
      "sig": "function primeiro(valores) { ... }",
      "starter": "function primeiro(valores) {\n  // acesse a primeira posição\n}",
      "fn": "primeiro",
      "difficulty": "facil",
      "xp": 120,
      "skill": "acessar uma posição de um array usando índice",
      "hints": [
        "Lembre que a primeira posição de uma lista começa em 0.",
        "Use os colchetes para acessar uma posição específica.",
        "A primeira posição está em valores[0].",
        "function primeiro(valores) {\n  return valores[0];\n}"
      ],
      "tests": [
        {
          "args": [
            [
              10,
              20,
              30
            ]
          ],
          "exp": 10
        },
        {
          "args": [
            [
              5
            ]
          ],
          "exp": 5
        },
        {
          "args": [
            [
              -2,
              8
            ]
          ],
          "exp": -2
        }
      ]
    },
    {
      "title": "Último elemento",
      "conceptIds": [
        "arrays",
        "arrayIndex",
        "arrayLength"
      ],
      "desc": "Retorne o último valor da lista.",
      "sig": "function ultimo(valores) { ... }",
      "starter": "function ultimo(valores) {\n  // encontre o último índice\n}",
      "fn": "ultimo",
      "difficulty": "facil",
      "xp": 140,
      "skill": "combinar length e índice para acessar o último item",
      "hints": [
        "Pense na relação entre quantidade de itens e índice.",
        "O tamanho está em valores.length, mas o último índice é um a menos.",
        "Acesse valores usando o índice valores.length - 1.",
        "function ultimo(valores) {\n  return valores[valores.length - 1];\n}"
      ],
      "tests": [
        {
          "args": [
            [
              10,
              20,
              30
            ]
          ],
          "exp": 30
        },
        {
          "args": [
            [
              5
            ]
          ],
          "exp": 5
        },
        {
          "args": [
            [
              -2,
              8,
              4
            ]
          ],
          "exp": 4
        }
      ]
    },
    {
      "title": "Somar a lista",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "accumulators"
      ],
      "desc": "Percorra a lista e retorne a soma de todos os seus valores.",
      "sig": "function somarLista(valores) { ... }",
      "starter": "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista e acumule os valores\n}",
      "fn": "somarLista",
      "difficulty": "medio",
      "xp": 180,
      "skill": "combinar array, for e acumulador",
      "hints": [
        "Pense no acumulador que você já usou no N3.",
        "Percorra os índices da lista e some cada valores[i] ao total.",
        "Use for com i começando em 0, enquanto i < valores.length, e faça total += valores[i].",
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
      "title": "Contar positivos",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "counters",
        "comparisons"
      ],
      "desc": "Retorne quantos valores da lista são maiores que zero.",
      "sig": "function contarPositivos(valores) { ... }",
      "starter": "function contarPositivos(valores) {\n  let quantidade = 0;\n\n  // conte os valores positivos\n}",
      "fn": "contarPositivos",
      "difficulty": "medio",
      "xp": 200,
      "skill": "combinar contador, condição e percurso de array",
      "hints": [
        "Pense no padrão de contador aprendido no N3.",
        "Percorra a lista e aumente a quantidade quando o valor for maior que zero.",
        "Dentro do for, use if (valores[i] > 0) e faça quantidade++.",
        "function contarPositivos(valores) {\n  let quantidade = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] > 0) quantidade++;\n  }\n\n  return quantidade;\n}"
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
              -2,
              4,
              7
            ]
          ],
          "exp": 2
        },
        {
          "args": [
            [
              -5,
              -1
            ]
          ],
          "exp": 0
        },
        {
          "args": [
            [
              1,
              2,
              3
            ]
          ],
          "exp": 3
        }
      ]
    },
    {
      "title": "Média da lista",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "accumulators",
        "division"
      ],
      "desc": "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.",
      "sig": "function mediaLista(valores) { ... }",
      "starter": "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}",
      "fn": "mediaLista",
      "difficulty": "medio",
      "xp": 240,
      "skill": "combinar soma, length e divisão",
      "hints": [
        "Uma média depende de uma soma e da quantidade de valores.",
        "Some os itens e depois divida pelo tamanho do array.",
        "Depois do for, retorne total / valores.length.",
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
        },
        {
          "args": [
            [
              -4,
              0,
              10
            ]
          ],
          "exp": 2
        }
      ]
    },
    {
      "title": "Menor valor",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "comparisons"
      ],
      "desc": "Percorra a lista e retorne o menor valor encontrado.",
      "sig": "function menorValor(valores) { ... }",
      "starter": "function menorValor(valores) {\n  let menor = valores[0];\n\n  // compare os próximos valores com menor\n}",
      "fn": "menorValor",
      "difficulty": "dificil",
      "xp": 280,
      "skill": "manter o menor valor encontrado durante um percurso",
      "hints": [
        "Pense no mesmo padrão usado para encontrar um maior valor.",
        "Comece com valores[0] e substitua menor quando encontrar um valor menor.",
        "Percorra a partir do índice 1 e, quando valores[i] < menor, atualize menor.",
        "function menorValor(valores) {\n  let menor = valores[0];\n\n  for (let i = 1; i < valores.length; i++) {\n    if (valores[i] < menor) menor = valores[i];\n  }\n\n  return menor;\n}"
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
          "exp": 2
        },
        {
          "args": [
            [
              -5,
              -2,
              -9
            ]
          ],
          "exp": -9
        },
        {
          "args": [
            [
              10,
              10,
              4
            ]
          ],
          "exp": 4
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
      "title": "Contém o valor",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "arraySearch",
        "comparisons"
      ],
      "desc": "Retorne true quando alvo estiver na lista e false quando não estiver.",
      "sig": "function contemValor(valores, alvo) { ... }",
      "starter": "function contemValor(valores, alvo) {\n  // procure o valor na lista\n}",
      "fn": "contemValor",
      "difficulty": "dificil",
      "xp": 300,
      "skill": "percorrer uma lista e interromper a busca quando encontrar o alvo",
      "hints": [
        "Pense em verificar cada posição até encontrar o valor procurado.",
        "Percorra o array e compare cada item com alvo usando ===.",
        "Quando valores[i] === alvo, você já pode retornar true; se o laço terminar, retorne false.",
        "function contemValor(valores, alvo) {\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] === alvo) {\n      return true;\n    }\n  }\n\n  return false;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              2,
              5,
              8
            ],
            5
          ],
          "exp": true
        },
        {
          "args": [
            [
              2,
              5,
              8
            ],
            7
          ],
          "exp": false
        },
        {
          "args": [
            [],
            10
          ],
          "exp": false
        },
        {
          "args": [
            [
              1,
              1,
              2
            ],
            1
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Apenas pares",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "arrayPush",
        "arrayFilter",
        "remainder"
      ],
      "desc": "Retorne uma nova lista contendo apenas os valores pares, na mesma ordem em que aparecem.",
      "sig": "function apenasPares(valores) { ... }",
      "starter": "function apenasPares(valores) {\n  const resultado = [];\n\n  // coloque na nova lista somente os pares\n}",
      "fn": "apenasPares",
      "difficulty": "dificil",
      "xp": 340,
      "skill": "percorrer, filtrar com if e construir um novo array",
      "hints": [
        "Você precisa construir outra lista sem alterar a original.",
        "Comece com [] e, durante o percurso, escolha quais valores devem entrar.",
        "Quando valores[i] % 2 === 0, use resultado.push(valores[i]).",
        "function apenasPares(valores) {\n  const resultado = [];\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] % 2 === 0) {\n      resultado.push(valores[i]);\n    }\n  }\n\n  return resultado;\n}"
      ],
      "tests": [
        {
          "args": [
            []
          ],
          "exp": []
        },
        {
          "args": [
            [
              1,
              2,
              3,
              4
            ]
          ],
          "exp": [
            2,
            4
          ]
        },
        {
          "args": [
            [
              1,
              3,
              5
            ]
          ],
          "exp": []
        },
        {
          "args": [
            [
              2,
              4
            ]
          ],
          "exp": [
            2,
            4
          ]
        }
      ]
    },
    {
      "title": "Inverter lista",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "arrayPush",
        "arrayReverse"
      ],
      "desc": "Retorne uma nova lista com os valores em ordem inversa.",
      "sig": "function inverterLista(valores) { ... }",
      "starter": "function inverterLista(valores) {\n  const resultado = [];\n\n  // percorra de trás para frente\n}",
      "fn": "inverterLista",
      "difficulty": "dificil",
      "xp": 380,
      "skill": "combinar índice regressivo e construção de novo array",
      "hints": [
        "Pense no mesmo padrão de inversão que você usou no N4.",
        "Comece pelo último índice e diminua até chegar a zero.",
        "Use i = valores.length - 1; enquanto i >= 0; acrescente valores[i] com push.",
        "function inverterLista(valores) {\n  const resultado = [];\n\n  for (let i = valores.length - 1; i >= 0; i--) {\n    resultado.push(valores[i]);\n  }\n\n  return resultado;\n}"
      ],
      "tests": [
        {
          "args": [
            []
          ],
          "exp": []
        },
        {
          "args": [
            [
              1,
              2,
              3
            ]
          ],
          "exp": [
            3,
            2,
            1
          ]
        },
        {
          "args": [
            [
              10,
              20
            ]
          ],
          "exp": [
            20,
            10
          ]
        },
        {
          "args": [
            [
              5
            ]
          ],
          "exp": [
            5
          ]
        }
      ]
    },
    {
      "title": "BOSS · Remover duplicados",
      "conceptIds": [
        "arrays",
        "arrayIteration",
        "arrayPush",
        "arraySearch",
        "arrayDuplicates"
      ],
      "desc": "Retorne uma nova lista contendo cada valor apenas uma vez, preservando a ordem da primeira aparição.",
      "sig": "function removerDuplicados(valores) { ... }",
      "starter": "function removerDuplicados(valores) {\n  const resultado = [];\n\n  // adicione um valor somente na primeira vez em que ele aparecer\n}",
      "fn": "removerDuplicados",
      "difficulty": "boss",
      "xp": 550,
      "skill": "combinar percurso, busca e construção de uma nova lista",
      "hints": [
        "Pense em construir a resposta aos poucos, sem alterar a lista original.",
        "Antes de adicionar um valor, descubra se ele já está em resultado.",
        "Use resultado.includes(valores[i]) para verificar se o valor já apareceu; só faça push quando não estiver presente.",
        "function removerDuplicados(valores) {\n  const resultado = [];\n\n  for (let i = 0; i < valores.length; i++) {\n    if (!resultado.includes(valores[i])) {\n      resultado.push(valores[i]);\n    }\n  }\n\n  return resultado;\n}"
      ],
      "tests": [
        {
          "args": [
            []
          ],
          "exp": []
        },
        {
          "args": [
            [
              1,
              2,
              2,
              3,
              1
            ]
          ],
          "exp": [
            1,
            2,
            3
          ]
        },
        {
          "args": [
            [
              5,
              5,
              5
            ]
          ],
          "exp": [
            5
          ]
        },
        {
          "args": [
            [
              1,
              2,
              3
            ]
          ],
          "exp": [
            1,
            2,
            3
          ]
        },
        {
          "args": [
            [
              2,
              1,
              2,
              1
            ]
          ],
          "exp": [
            2,
            1
          ]
        }
      ]
    }
  ]
};
