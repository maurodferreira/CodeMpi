import type { Level } from '../contentTypes';

export const N2_LEVEL: Level = {
  "name": "Condicionais",
  "tag": "N2",
  "exercises": [
    {
      "title": "Par ou ímpar",
      "conceptIds": [
        "remainder",
        "comparisons"
      ],
      "desc": "Retorne true se o número for par e false se for ímpar.",
      "sig": "function ehPar(n) { ... }",
      "starter": "function ehPar(n) {\n  // use o resto da divisão\n\n}",
      "fn": "ehPar",
      "difficulty": "facil",
      "xp": 120,
      "skill": "condicionais e operador de resto",
      "hints": [
        "Pense em como descobrir se um número é divisível por 2.",
        "Use % para verificar se o resto da divisão por 2 é zero.",
        "A condição que resolve a missão é verificar se o resto de n por 2 é exatamente 0.",
        "function ehPar(n) {\n  if (n % 2 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            4
          ],
          "exp": true
        },
        {
          "args": [
            7
          ],
          "exp": false
        },
        {
          "args": [
            0
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Positivo, negativo ou zero",
      "conceptIds": [
        "conditionals",
        "comparisons"
      ],
      "desc": "Retorne 'positivo', 'negativo' ou 'zero' de acordo com o valor recebido.",
      "sig": "function classificarNumero(n) { ... }",
      "starter": "function classificarNumero(n) {\n  // pense nos três caminhos possíveis\n\n}",
      "fn": "classificarNumero",
      "difficulty": "facil",
      "xp": 120,
      "skill": "if e else para escolher caminhos",
      "hints": [
        "Pense nos três caminhos possíveis para o valor recebido.",
        "Verifique primeiro se n é maior que zero, depois se é menor que zero.",
        "Use dois testes em sequência: primeiro n > 0, depois n < 0; se nenhum for verdadeiro, sobrou o caso zero.",
        "function classificarNumero(n) {\n  if (n > 0) {\n    return 'positivo';\n  } else if (n < 0) {\n    return 'negativo';\n  }\n\n  return 'zero';\n}"
      ],
      "tests": [
        {
          "args": [
            8
          ],
          "exp": "positivo"
        },
        {
          "args": [
            -2
          ],
          "exp": "negativo"
        },
        {
          "args": [
            0
          ],
          "exp": "zero"
        }
      ]
    },
    {
      "title": "Maior número",
      "conceptIds": [
        "conditionals",
        "comparisons"
      ],
      "desc": "Retorne o maior entre a e b.",
      "sig": "function maior(a, b) { ... }",
      "starter": "function maior(a, b) {\n\n}",
      "fn": "maior",
      "difficulty": "facil",
      "xp": 120,
      "skill": "comparações com if e else",
      "hints": [
        "Pense em como comparar dois números.",
        "Compare a com b; se a não for maior, b é o resultado.",
        "Uma forma direta é retornar a quando a > b e, caso contrário, retornar b.",
        "function maior(a, b) {\n  if (a > b) {\n    return a;\n  } else {\n    return b;\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            10,
            4
          ],
          "exp": 10
        },
        {
          "args": [
            3,
            9
          ],
          "exp": 9
        },
        {
          "args": [
            5,
            5
          ],
          "exp": 5
        }
      ]
    },
    {
      "title": "Pode dirigir?",
      "conceptIds": [
        "comparisons"
      ],
      "desc": "Retorne true quando a idade for 18 ou mais.",
      "sig": "function podeDirigir(idade) { ... }",
      "starter": "function podeDirigir(idade) {\n\n}",
      "fn": "podeDirigir",
      "difficulty": "medio",
      "xp": 180,
      "skill": "comparação com maior ou igual",
      "hints": [
        "Pense no limite mínimo de idade pedido pela missão.",
        "A condição precisa aceitar 18, então use uma comparação de maior ou igual.",
        "Compare idade com 18 usando >=, porque a idade 18 também precisa passar.",
        "function podeDirigir(idade) {\n  if (idade >= 18) {\n    return true;\n  } else {\n    return false;\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            18
          ],
          "exp": true
        },
        {
          "args": [
            17
          ],
          "exp": false
        },
        {
          "args": [
            25
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Aprovado ou reprovado",
      "conceptIds": [
        "conditionals",
        "comparisons"
      ],
      "desc": "Retorne 'aprovado' para nota maior ou igual a 7; caso contrário, 'reprovado'.",
      "sig": "function resultado(nota) { ... }",
      "starter": "function resultado(nota) {\n\n}",
      "fn": "resultado",
      "difficulty": "medio",
      "xp": 180,
      "skill": "if e else com regra de negócio",
      "hints": [
        "Pense na nota mínima necessária para cada resultado.",
        "Compare a nota com 7 usando >= e escolha entre os dois resultados.",
        "A condição central é nota >= 7; dependendo dela, retorne um dos dois textos pedidos.",
        "function resultado(nota) {\n  if (nota >= 7) {\n    return 'aprovado';\n  } else {\n    return 'reprovado';\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            8
          ],
          "exp": "aprovado"
        },
        {
          "args": [
            7
          ],
          "exp": "aprovado"
        },
        {
          "args": [
            6.9
          ],
          "exp": "reprovado"
        }
      ]
    },
    {
      "title": "Desconto na compra",
      "conceptIds": [
        "conditionals",
        "comparisons",
        "multiplication"
      ],
      "desc": "Dê 10% de desconto quando o valor for maior ou igual a 100. Caso contrário, mantenha o valor.",
      "sig": "function precoFinal(valor) { ... }",
      "starter": "function precoFinal(valor) {\n  // escolha qual caminho seguir\n\n}",
      "fn": "precoFinal",
      "difficulty": "medio",
      "xp": 220,
      "skill": "condição com cálculo",
      "hints": [
        "Pense primeiro em quando o desconto deve acontecer.",
        "Se o valor for pelo menos 100, o cliente paga 90% do preço.",
        "Quando valor >= 100, o preço final representa 90% do original; quando não, mantenha o valor.",
        "function precoFinal(valor) {\n  if (valor >= 100) {\n    return valor * 0.9;\n  } else {\n    return valor;\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            100
          ],
          "exp": 90
        },
        {
          "args": [
            250
          ],
          "exp": 225
        },
        {
          "args": [
            80
          ],
          "exp": 80
        }
      ]
    },
    {
      "title": "Classificação de temperatura",
      "conceptIds": [
        "conditionals",
        "comparisons"
      ],
      "desc": "Retorne 'frio' abaixo de 15, 'agradavel' de 15 até 29 e 'quente' a partir de 30.",
      "sig": "function classificarTemperatura(t) { ... }",
      "starter": "function classificarTemperatura(t) {\n  // existem três caminhos\n\n}",
      "fn": "classificarTemperatura",
      "difficulty": "dificil",
      "xp": 300,
      "skill": "múltiplas condições com else if",
      "hints": [
        "Pense nas três faixas de temperatura da missão.",
        "Verifique primeiro abaixo de 15, depois abaixo de 30; o restante é quente.",
        "As faixas podem ser resolvidas em ordem crescente: abaixo de 15, abaixo de 30 e, por fim, o restante.",
        "function classificarTemperatura(t) {\n  if (t < 15) {\n    return 'frio';\n  } else if (t < 30) {\n    return 'agradavel';\n  }\n\n  return 'quente';\n}"
      ],
      "tests": [
        {
          "args": [
            10
          ],
          "exp": "frio"
        },
        {
          "args": [
            15
          ],
          "exp": "agradavel"
        },
        {
          "args": [
            30
          ],
          "exp": "quente"
        }
      ]
    },
    {
      "title": "Compra aprovada",
      "conceptIds": [
        "comparisons",
        "booleanLogic",
        "conditionals"
      ],
      "desc": "Retorne true somente quando o valor da compra for 50 ou mais e o pagamento estiver aprovado.",
      "sig": "function compraAprovada(valor, pagamentoAprovado) { ... }",
      "starter": "function compraAprovada(valor, pagamentoAprovado) {\n\n}",
      "fn": "compraAprovada",
      "difficulty": "dificil",
      "xp": 320,
      "skill": "combinar duas condições com &&",
      "hints": [
        "Pense nas duas regras que precisam ser verdadeiras ao mesmo tempo.",
        "Compare o valor com 50 e use a informação sobre o pagamento aprovado.",
        "As duas condições precisam ser verdadeiras: valor >= 50 e pagamentoAprovado. Use && para combiná-las.",
        "function compraAprovada(valor, pagamentoAprovado) {\n  if (valor >= 50 && pagamentoAprovado) {\n    return true;\n  }\n\n  return false;\n}"
      ],
      "tests": [
        {
          "args": [
            50,
            true
          ],
          "exp": true
        },
        {
          "args": [
            49.99,
            true
          ],
          "exp": false
        },
        {
          "args": [
            100,
            false
          ],
          "exp": false
        },
        {
          "args": [
            80,
            true
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Frete grátis",
      "conceptIds": [
        "comparisons",
        "booleanLogic",
        "conditionals"
      ],
      "desc": "Retorne 'gratis' se a compra for 200 ou mais ou se o cliente for assinante. Caso contrário, retorne 'pago'.",
      "sig": "function tipoFrete(valor, assinante) { ... }",
      "starter": "function tipoFrete(valor, assinante) {\n\n}",
      "fn": "tipoFrete",
      "difficulty": "dificil",
      "xp": 350,
      "skill": "combinar condições com ||",
      "hints": [
        "Pense nas duas situações que liberam o frete grátis.",
        "Use || porque basta a compra atingir 200 ou o cliente ser assinante.",
        "Como basta uma das regras, use uma condição com OR entre valor >= 200 e assinante.",
        "function tipoFrete(valor, assinante) {\n  if (valor >= 200 || assinante) {\n    return 'gratis';\n  } else {\n    return 'pago';\n  }\n}"
      ],
      "tests": [
        {
          "args": [
            200,
            false
          ],
          "exp": "gratis"
        },
        {
          "args": [
            250,
            false
          ],
          "exp": "gratis"
        },
        {
          "args": [
            100,
            true
          ],
          "exp": "gratis"
        },
        {
          "args": [
            100,
            false
          ],
          "exp": "pago"
        }
      ]
    },
    {
      "title": "BOSS · Classificador de acesso",
      "conceptIds": [
        "conditionals",
        "comparisons",
        "booleanLogic"
      ],
      "desc": "Classifique o acesso: 'bloqueado' se a conta estiver inativa; 'admin' se estiver ativa e for admin; 'usuario' nos demais casos.",
      "sig": "function classificarAcesso(ativo, admin) { ... }",
      "starter": "function classificarAcesso(ativo, admin) {\n  // pense na ordem das condições\n\n}",
      "fn": "classificarAcesso",
      "difficulty": "boss",
      "xp": 550,
      "skill": "ordenar múltiplas condições",
      "hints": [
        "Pense na ordem das regras: conta inativa, admin ativo e usuário ativo.",
        "Trate o caso inativo primeiro; depois verifique admin e, por fim, o usuário comum.",
        "Trate a conta inativa primeiro; se estiver ativa, admin define o segundo caminho e o restante é usuário.",
        "function classificarAcesso(ativo, admin) {\n  if (!ativo) {\n    return 'bloqueado';\n  } else if (admin) {\n    return 'admin';\n  }\n\n  return 'usuario';\n}"
      ],
      "tests": [
        {
          "args": [
            false,
            true
          ],
          "exp": "bloqueado"
        },
        {
          "args": [
            true,
            true
          ],
          "exp": "admin"
        },
        {
          "args": [
            true,
            false
          ],
          "exp": "usuario"
        }
      ]
    }
  ]
};
