import type { Level } from '../contentTypes';

export const N6_LEVEL: Level = {
  "name": "Funções e Lógica",
  "tag": "N6",
  "exercises": [
    {
      "title": "Preço com acréscimo",
      "conceptIds": [
        "functions",
        "parameters",
        "localVariables",
        "percentage"
      ],
      "desc": "Receba um valor e uma taxa percentual e retorne o valor com o acréscimo aplicado.",
      "sig": "function precoComTaxa(valor, taxa) { ... }",
      "starter": "function precoComTaxa(valor, taxa) {\n  // calcule o valor do acréscimo\n}",
      "fn": "precoComTaxa",
      "difficulty": "facil",
      "xp": 120,
      "skill": "usar parâmetros e uma variável local para construir um resultado",
      "hints": [
        "Pense em quanto a taxa representa do valor original.",
        "Calcule o acréscimo usando valor * taxa / 100 e some-o ao valor.",
        "Guarde o resultado em uma variável, como total, e retorne valor + valor * taxa / 100.",
        "function precoComTaxa(valor, taxa) {\n  const total = valor + valor * taxa / 100;\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            100,
            10
          ],
          "exp": 110
        },
        {
          "args": [
            80,
            25
          ],
          "exp": 100
        },
        {
          "args": [
            50,
            0
          ],
          "exp": 50
        }
      ]
    },
    {
      "title": "Está no intervalo",
      "conceptIds": [
        "functions",
        "parameters",
        "booleanFunctions",
        "comparisons",
        "booleanLogic"
      ],
      "desc": "Retorne true quando numero estiver entre minimo e maximo, incluindo os dois limites.",
      "sig": "function estaNoIntervalo(numero, minimo, maximo) { ... }",
      "starter": "function estaNoIntervalo(numero, minimo, maximo) {\n  // verifique os dois limites\n}",
      "fn": "estaNoIntervalo",
      "difficulty": "medio",
      "xp": 160,
      "skill": "criar uma função booleana combinando comparações",
      "hints": [
        "A pergunta precisa confirmar duas coisas ao mesmo tempo.",
        "Verifique se numero é maior ou igual a minimo e menor ou igual a maximo.",
        "Combine numero >= minimo e numero <= maximo com && e retorne o resultado.",
        "function estaNoIntervalo(numero, minimo, maximo) {\n  return numero >= minimo && numero <= maximo;\n}"
      ],
      "tests": [
        {
          "args": [
            5,
            0,
            10
          ],
          "exp": true
        },
        {
          "args": [
            -1,
            0,
            10
          ],
          "exp": false
        },
        {
          "args": [
            10,
            0,
            10
          ],
          "exp": true
        },
        {
          "args": [
            11,
            0,
            10
          ],
          "exp": false
        }
      ]
    },
    {
      "title": "Nota válida",
      "conceptIds": [
        "functions",
        "parameters",
        "booleanFunctions",
        "validation",
        "booleanLogic"
      ],
      "desc": "Retorne true somente quando a nota estiver entre 0 e 10, incluindo os limites.",
      "sig": "function notaValida(nota) { ... }",
      "starter": "function notaValida(nota) {\n  // valide a entrada\n}",
      "fn": "notaValida",
      "difficulty": "medio",
      "xp": 180,
      "skill": "validar uma entrada com limites inclusivos",
      "hints": [
        "Uma nota válida precisa obedecer aos dois limites.",
        "Verifique se nota não é menor que 0 e não é maior que 10.",
        "Use nota >= 0 && nota <= 10 e retorne diretamente o booleano.",
        "function notaValida(nota) {\n  return nota >= 0 && nota <= 10;\n}"
      ],
      "tests": [
        {
          "args": [
            0
          ],
          "exp": true
        },
        {
          "args": [
            7
          ],
          "exp": true
        },
        {
          "args": [
            10
          ],
          "exp": true
        },
        {
          "args": [
            -0.1
          ],
          "exp": false
        },
        {
          "args": [
            10.1
          ],
          "exp": false
        }
      ]
    },
    {
      "title": "Classificar nota",
      "conceptIds": [
        "functions",
        "parameters",
        "validation",
        "conditionals",
        "comparisons",
        "earlyReturn"
      ],
      "desc": "Classifique a nota: 'invalida' fora de 0 a 10; 'reprovado' abaixo de 5; 'recuperacao' de 5 até menos de 7; 'aprovado' de 7 a 10.",
      "sig": "function classificarNota(nota) { ... }",
      "starter": "function classificarNota(nota) {\n  // valide primeiro e depois classifique\n}",
      "fn": "classificarNota",
      "difficulty": "medio",
      "xp": 240,
      "skill": "ordenar validação e múltiplos caminhos dentro de uma função",
      "hints": [
        "Separe o problema em duas partes: entrada válida e classificação.",
        "Trate primeiro valores menores que 0 ou maiores que 10; depois use as faixas 5 e 7.",
        "Faça um retorno antecipado para notas inválidas; em seguida use if/else if para reprovado, recuperação e aprovado.",
        "function classificarNota(nota) {\n  if (nota < 0 || nota > 10) return 'invalida';\n  if (nota < 5) return 'reprovado';\n  if (nota < 7) return 'recuperacao';\n  return 'aprovado';\n}"
      ],
      "tests": [
        {
          "args": [
            -1
          ],
          "exp": "invalida"
        },
        {
          "args": [
            0
          ],
          "exp": "reprovado"
        },
        {
          "args": [
            5
          ],
          "exp": "recuperacao"
        },
        {
          "args": [
            6.9
          ],
          "exp": "recuperacao"
        },
        {
          "args": [
            7
          ],
          "exp": "aprovado"
        },
        {
          "args": [
            10
          ],
          "exp": "aprovado"
        },
        {
          "args": [
            10.1
          ],
          "exp": "invalida"
        }
      ]
    },
    {
      "title": "Preço com desconto progressivo",
      "conceptIds": [
        "functions",
        "parameters",
        "localVariables",
        "conditionals",
        "comparisons",
        "multiplication",
        "percentage"
      ],
      "desc": "Retorne o preço final: sem desconto abaixo de 100, 10% de desconto de 100 até 199,99 e 20% de desconto a partir de 200.",
      "sig": "function precoComDesconto(valor) { ... }",
      "starter": "function precoComDesconto(valor) {\n  // escolha a faixa de desconto\n}",
      "fn": "precoComDesconto",
      "difficulty": "dificil",
      "xp": 280,
      "skill": "combinar condição, cálculo percentual e variável local",
      "hints": [
        "Existem três faixas de preço.",
        "Descubra primeiro qual percentual se aplica e depois calcule o preço final.",
        "Use 0% abaixo de 100, 10% a partir de 100 e 20% a partir de 200; depois aplique o percentual ao valor.",
        "function precoComDesconto(valor) {\n  let desconto = 0;\n\n  if (valor >= 200) {\n    desconto = 20;\n  } else if (valor >= 100) {\n    desconto = 10;\n  }\n\n  return valor * (1 - desconto / 100);\n}"
      ],
      "tests": [
        {
          "args": [
            80
          ],
          "exp": 80
        },
        {
          "args": [
            100
          ],
          "exp": 90
        },
        {
          "args": [
            150
          ],
          "exp": 135
        },
        {
          "args": [
            200
          ],
          "exp": 160
        },
        {
          "args": [
            250
          ],
          "exp": 200
        }
      ]
    },
    {
      "title": "Montante com juros simples",
      "conceptIds": [
        "functions",
        "parameters",
        "localVariables",
        "multiplication",
        "division",
        "percentage"
      ],
      "desc": "Retorne o montante final usando juros simples: principal + principal × taxa × meses / 100. A taxa é informada em porcentagem.",
      "sig": "function montanteJuros(principal, taxa, meses) { ... }",
      "starter": "function montanteJuros(principal, taxa, meses) {\n  // calcule os juros e some ao principal\n}",
      "fn": "montanteJuros",
      "difficulty": "dificil",
      "xp": 300,
      "skill": "dividir uma fórmula em etapas com variáveis locais",
      "hints": [
        "Pense primeiro em calcular somente os juros.",
        "Os juros são principal × taxa × meses / 100; depois some esse valor ao principal.",
        "Use uma variável juros para a fórmula e retorne principal + juros.",
        "function montanteJuros(principal, taxa, meses) {\n  const juros = principal * taxa * meses / 100;\n  return principal + juros;\n}"
      ],
      "tests": [
        {
          "args": [
            1000,
            2,
            3
          ],
          "exp": 1060
        },
        {
          "args": [
            500,
            5,
            4
          ],
          "exp": 600
        },
        {
          "args": [
            100,
            0,
            12
          ],
          "exp": 100
        }
      ]
    },
    {
      "title": "Fibonacci",
      "conceptIds": [
        "functions",
        "parameters",
        "localVariables",
        "conditionals",
        "comparisons",
        "earlyReturn",
        "loops",
        "sequentialState"
      ],
      "desc": "Retorne o n-ésimo número da sequência de Fibonacci. Considere F(0) = 0 e F(1) = 1.",
      "sig": "function fibonacci(n) { ... }",
      "starter": "function fibonacci(n) {\n  // construa a sequência até chegar em n\n}",
      "fn": "fibonacci",
      "difficulty": "dificil",
      "xp": 360,
      "skill": "combinar função, laço e atualização de vários valores",
      "hints": [
        "Comece pelos dois primeiros valores: 0 e 1.",
        "A cada passo, o próximo valor é a soma dos dois anteriores.",
        "Guarde dois valores, some-os para obter o próximo e avance as duas variáveis até chegar à posição n.",
        "function fibonacci(n) {\n  if (n === 0) return 0;\n  if (n === 1) return 1;\n\n  let anterior = 0;\n  let atual = 1;\n\n  for (let i = 2; i <= n; i++) {\n    const proximo = anterior + atual;\n    anterior = atual;\n    atual = proximo;\n  }\n\n  return atual;\n}"
      ],
      "tests": [
        {
          "args": [
            0
          ],
          "exp": 0
        },
        {
          "args": [
            1
          ],
          "exp": 1
        },
        {
          "args": [
            2
          ],
          "exp": 1
        },
        {
          "args": [
            6
          ],
          "exp": 8
        },
        {
          "args": [
            10
          ],
          "exp": 55
        }
      ]
    },
    {
      "title": "Total da lista com taxa",
      "conceptIds": [
        "functions",
        "parameters",
        "functionComposition",
        "arrayIteration",
        "accumulators",
        "percentage"
      ],
      "desc": "Crie a função somarLista para somar um array e use-a dentro de totalComTaxa para aplicar uma taxa percentual ao subtotal.",
      "sig": "function totalComTaxa(valores, taxa) { ... }",
      "starter": "function somarLista(valores) {\n  // reutilize o padrão do N5\n}\n\nfunction totalComTaxa(valores, taxa) {\n  // use somarLista aqui\n}",
      "fn": "totalComTaxa",
      "difficulty": "dificil",
      "xp": 380,
      "skill": "reutilizar uma função auxiliar dentro de outra",
      "hints": [
        "Divida o problema: primeiro obtenha o subtotal, depois aplique a taxa.",
        "A função totalComTaxa não precisa percorrer a lista novamente se somarLista já fizer isso.",
        "Complete somarLista, chame-a dentro de totalComTaxa, guarde o subtotal e retorne subtotal + subtotal * taxa / 100.",
        "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}\n\nfunction totalComTaxa(valores, taxa) {\n  const subtotal = somarLista(valores);\n  return subtotal + subtotal * taxa / 100;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              10,
              20
            ],
            10
          ],
          "exp": 33
        },
        {
          "args": [
            [
              100,
              50
            ],
            20
          ],
          "exp": 180
        },
        {
          "args": [
            [],
            10
          ],
          "exp": 0
        },
        {
          "args": [
            [
              5,
              -2
            ],
            10
          ],
          "exp": 3.3
        }
      ]
    },
    {
      "title": "Taxa de aprovação",
      "conceptIds": [
        "functions",
        "parameters",
        "functionComposition",
        "arrayIteration",
        "counters",
        "comparisons",
        "division"
      ],
      "desc": "Crie contarAprovados(notas, minimo) e use-a dentro de taxaAprovacao para retornar a porcentagem de notas aprovadas. Lista vazia retorna 0.",
      "sig": "function taxaAprovacao(notas, minimo) { ... }",
      "starter": "function contarAprovados(notas, minimo) {\n  // conte usando o padrão do N5\n}\n\nfunction taxaAprovacao(notas, minimo) {\n  // reutilize contarAprovados\n}",
      "fn": "taxaAprovacao",
      "difficulty": "dificil",
      "xp": 420,
      "skill": "combinar função auxiliar, contador, array e divisão",
      "hints": [
        "Primeiro descubra quantas notas atingem o mínimo.",
        "Depois divida a quantidade aprovada pelo total de notas e multiplique por 100.",
        "Faça contarAprovados retornar a quantidade; em taxaAprovacao, trate notas.length === 0 e depois use aprovados / notas.length * 100.",
        "function contarAprovados(notas, minimo) {\n  let quantidade = 0;\n\n  for (let i = 0; i < notas.length; i++) {\n    if (notas[i] >= minimo) quantidade++;\n  }\n\n  return quantidade;\n}\n\nfunction taxaAprovacao(notas, minimo) {\n  if (notas.length === 0) return 0;\n\n  const aprovados = contarAprovados(notas, minimo);\n  return aprovados / notas.length * 100;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              10,
              8
            ],
            7
          ],
          "exp": 100
        },
        {
          "args": [
            [
              7,
              6,
              5,
              9
            ],
            7
          ],
          "exp": 50
        },
        {
          "args": [
            [
              4,
              5
            ],
            7
          ],
          "exp": 0
        },
        {
          "args": [
            [],
            7
          ],
          "exp": 0
        }
      ]
    },
    {
      "title": "BOSS · Finalizar compra",
      "conceptIds": [
        "functions",
        "parameters",
        "localVariables",
        "validation",
        "functionComposition",
        "multiStepLogic",
        "arrayIteration",
        "accumulators",
        "comparisons",
        "multiplication",
        "percentage"
      ],
      "desc": "Some os valores com somarLista, aplique o percentual de desconto com aplicarDesconto e adicione o frete apenas se o total após desconto ficar abaixo de 200. Retorne 0 para lista vazia ou desconto fora de 0 a 50.",
      "sig": "function finalizarCompra(valores, desconto, frete) { ... }",
      "starter": "function somarLista(valores) {\n  // some a lista\n}\n\nfunction aplicarDesconto(valor, percentual) {\n  // aplique o desconto\n}\n\nfunction finalizarCompra(valores, desconto, frete) {\n  // valide e combine as funções auxiliares\n}",
      "fn": "finalizarCompra",
      "difficulty": "boss",
      "xp": 550,
      "skill": "combinar funções auxiliares, validação, array e regras de negócio em etapas",
      "hints": [
        "Quebre o problema em três etapas: validar, calcular subtotal e calcular o total final.",
        "Use somarLista para obter o subtotal e aplicarDesconto para gerar o valor após desconto. Depois decida sobre o frete.",
        "Retorne 0 se valores estiver vazio ou desconto < 0 ou desconto > 50; calcule subtotal; aplique desconto; se o resultado for menor que 200, some frete.",
        "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}\n\nfunction aplicarDesconto(valor, percentual) {\n  return valor * (1 - percentual / 100);\n}\n\nfunction finalizarCompra(valores, desconto, frete) {\n  if (valores.length === 0 || desconto < 0 || desconto > 50) return 0;\n\n  const subtotal = somarLista(valores);\n  const totalComDesconto = aplicarDesconto(subtotal, desconto);\n\n  if (totalComDesconto < 200) {\n    return totalComDesconto + frete;\n  }\n\n  return totalComDesconto;\n}"
      ],
      "tests": [
        {
          "args": [
            [],
            10,
            20
          ],
          "exp": 0
        },
        {
          "args": [
            [
              100,
              50
            ],
            10,
            20
          ],
          "exp": 155
        },
        {
          "args": [
            [
              100,
              50,
              50
            ],
            10,
            20
          ],
          "exp": 200
        },
        {
          "args": [
            [
              250
            ],
            0,
            20
          ],
          "exp": 250
        },
        {
          "args": [
            [
              100,
              100
            ],
            51,
            20
          ],
          "exp": 0
        },
        {
          "args": [
            [
              200
            ],
            10,
            50
          ],
          "exp": 230
        }
      ]
    }
  ]
};
