import type { Level } from '../contentTypes';

export const N1_LEVEL: Level = {
  "name": "Variáveis e Operadores",
  "tag": "N1",
  "exercises": [
    {
      "title": "Soma de dois números",
      "conceptIds": [
        "return",
        "addition"
      ],
      "desc": "Complete a função para que ela retorne a soma de a e b.",
      "sig": "function somar(a, b) { ... }",
      "starter": "function somar(a, b) {\n  // escreva seu código aqui\n\n}",
      "fn": "somar",
      "difficulty": "facil",
      "xp": 100,
      "skill": "devolver um valor usando return e somar os parâmetros",
      "hints": [
        "Pense no que a função precisa devolver.",
        "Use return para devolver a soma de a com b.",
        "Agora transforme os dois valores em um único resultado usando o operador + dentro da função.",
        "function somar(a, b) {\n  return a + b;\n}"
      ],
      "tests": [
        {
          "args": [
            2,
            3
          ],
          "exp": 5
        },
        {
          "args": [
            -1,
            1
          ],
          "exp": 0
        },
        {
          "args": [
            10,
            15
          ],
          "exp": 25
        }
      ]
    },
    {
      "title": "Subtração de dois números",
      "conceptIds": [
        "return",
        "subtraction"
      ],
      "desc": "Retorne o resultado de a menos b.",
      "sig": "function subtrair(a, b) { ... }",
      "starter": "function subtrair(a, b) {\n\n}",
      "fn": "subtrair",
      "difficulty": "facil",
      "xp": 100,
      "skill": "usar o operador - para subtrair o segundo parâmetro do primeiro",
      "hints": [
        "Pense no resultado que a função precisa devolver.",
        "Use return e subtraia b de a.",
        "A operação deve acontecer na ordem a - b e o resultado precisa ser devolvido.",
        "function subtrair(a, b) {\n  return a - b;\n}"
      ],
      "tests": [
        {
          "args": [
            10,
            4
          ],
          "exp": 6
        },
        {
          "args": [
            5,
            5
          ],
          "exp": 0
        },
        {
          "args": [
            3,
            10
          ],
          "exp": -7
        }
      ]
    },
    {
      "title": "Dobro de um número",
      "conceptIds": [
        "return",
        "multiplication"
      ],
      "desc": "Retorne o dobro (n × 2) do número recebido.",
      "sig": "function dobro(n) { ... }",
      "starter": "function dobro(n) {\n\n}",
      "fn": "dobro",
      "difficulty": "facil",
      "xp": 100,
      "skill": "usar o operador * para multiplicar o valor por 2",
      "hints": [
        "Pense em como transformar n no dobro.",
        "Multiplique n por 2 e devolva o resultado com return.",
        "O dobro é o número multiplicado por 2. Faça essa operação dentro da função e devolva o resultado.",
        "function dobro(n) {\n  return n * 2;\n}"
      ],
      "tests": [
        {
          "args": [
            4
          ],
          "exp": 8
        },
        {
          "args": [
            0
          ],
          "exp": 0
        },
        {
          "args": [
            -3
          ],
          "exp": -6
        }
      ]
    },
    {
      "title": "Multiplicação de dois números",
      "conceptIds": [
        "return",
        "multiplication"
      ],
      "desc": "Retorne o produto de a e b.",
      "sig": "function multiplicar(a, b) { ... }",
      "starter": "function multiplicar(a, b) {\n\n}",
      "fn": "multiplicar",
      "difficulty": "medio",
      "xp": 200,
      "skill": "usar o operador * entre dois valores",
      "hints": [
        "Pense em qual operação transforma os dois parâmetros em um produto.",
        "Use o operador * entre a e b e devolva o resultado com return.",
        "Coloque a operação de multiplicação entre a e b dentro da função e devolva o produto.",
        "function multiplicar(a, b) {\n  return a * b;\n}"
      ],
      "tests": [
        {
          "args": [
            3,
            4
          ],
          "exp": 12
        },
        {
          "args": [
            0,
            9
          ],
          "exp": 0
        },
        {
          "args": [
            -2,
            5
          ],
          "exp": -10
        }
      ]
    },
    {
      "title": "Divisão de dois números",
      "conceptIds": [
        "return",
        "division"
      ],
      "desc": "Retorne o resultado de a dividido por b. O resultado pode ser decimal.",
      "sig": "function dividir(a, b) { ... }",
      "starter": "function dividir(a, b) {\n\n}",
      "fn": "dividir",
      "difficulty": "medio",
      "xp": 200,
      "skill": "usar o operador / para dividir dois valores",
      "hints": [
        "Pense em qual operação transforma os dois parâmetros em um quociente.",
        "Use / entre a e b e devolva o resultado com return.",
        "Divida o primeiro parâmetro pelo segundo e devolva diretamente o resultado.",
        "function dividir(a, b) {\n  return a / b;\n}"
      ],
      "tests": [
        {
          "args": [
            10,
            2
          ],
          "exp": 5
        },
        {
          "args": [
            7,
            2
          ],
          "exp": 3.5
        },
        {
          "args": [
            9,
            3
          ],
          "exp": 3
        }
      ]
    },
    {
      "title": "Atualizando o total",
      "conceptIds": [
        "return",
        "variables",
        "addition"
      ],
      "desc": "Comece com pontos como total, adicione o bonus ao total e retorne o novo valor.",
      "sig": "function adicionarBonus(pontos, bonus) { ... }",
      "starter": "function adicionarBonus(pontos, bonus) {\n  let total = pontos;\n\n  // atualize total e depois retorne o resultado\n}",
      "fn": "adicionarBonus",
      "difficulty": "medio",
      "xp": 200,
      "skill": "criar uma variável e atualizar seu valor usando uma operação",
      "hints": [
        "Pense em uma variável que represente o valor que será atualizado.",
        "Crie total começando com pontos e some bonus a esse total.",
        "Primeiro use let total = pontos; depois atualize com total = total + bonus e retorne total.",
        "function adicionarBonus(pontos, bonus) {\n  let total = pontos;\n  total = total + bonus;\n\n  return total;\n}"
      ],
      "tests": [
        {
          "args": [
            100,
            25
          ],
          "exp": 125
        },
        {
          "args": [
            0,
            10
          ],
          "exp": 10
        },
        {
          "args": [
            50,
            -5
          ],
          "exp": 45
        }
      ]
    },
    {
      "title": "Média de três números",
      "conceptIds": [
        "return",
        "addition",
        "division",
        "expressions"
      ],
      "desc": "Receba três números e retorne a média aritmética entre eles.",
      "sig": "function media3(a, b, c) { ... }",
      "starter": "function media3(a, b, c) {\n  // some os três e divida por 3\n\n}",
      "fn": "media3",
      "difficulty": "dificil",
      "xp": 350,
      "skill": "combinar soma e divisão para calcular uma média",
      "hints": [
        "Pense nas duas etapas necessárias para calcular uma média.",
        "Some a, b e c e depois divida a soma por 3.",
        "Primeiro forme a soma dos três valores; depois transforme essa soma na média dividindo por 3.",
        "function media3(a, b, c) {\n  return (a + b + c) / 3;\n}"
      ],
      "tests": [
        {
          "args": [
            3,
            6,
            9
          ],
          "exp": 6
        },
        {
          "args": [
            10,
            10,
            10
          ],
          "exp": 10
        },
        {
          "args": [
            1,
            2,
            3
          ],
          "exp": 2
        }
      ]
    },
    {
      "title": "Resto da divisão",
      "conceptIds": [
        "return",
        "remainder"
      ],
      "desc": "Retorne o resto da divisão de a por b.",
      "sig": "function resto(a, b) { ... }",
      "starter": "function resto(a, b) {\n\n}",
      "fn": "resto",
      "difficulty": "medio",
      "xp": 350,
      "skill": "usar o operador % para obter o resto da divisão",
      "hints": [
        "Pense no que sobra depois de uma divisão.",
        "Use o operador % para obter o resto de a por b.",
        "Você não precisa calcular a divisão inteira: o operador % já devolve diretamente o que sobra.",
        "function resto(a, b) {\n  return a % b;\n}"
      ],
      "tests": [
        {
          "args": [
            10,
            3
          ],
          "exp": 1
        },
        {
          "args": [
            20,
            5
          ],
          "exp": 0
        },
        {
          "args": [
            7,
            2
          ],
          "exp": 1
        }
      ]
    },
    {
      "title": "Celsius para Fahrenheit",
      "conceptIds": [
        "return",
        "multiplication",
        "division",
        "addition",
        "expressions"
      ],
      "desc": "Receba uma temperatura em Celsius e retorne o equivalente em Fahrenheit.",
      "sig": "function celsiusParaFahrenheit(c) { ... }",
      "starter": "function celsiusParaFahrenheit(c) {\n  // Fahrenheit = Celsius * 9/5 + 32\n\n}",
      "fn": "celsiusParaFahrenheit",
      "difficulty": "dificil",
      "xp": 350,
      "skill": "aplicar a fórmula Celsius × 9 / 5 + 32 na ordem correta",
      "hints": [
        "Pense na fórmula que transforma Celsius em Fahrenheit.",
        "Aplique c × 9, divida por 5 e some 32.",
        "A expressão final combina multiplicação, divisão e soma: c × 9 / 5 + 32.",
        "function celsiusParaFahrenheit(c) {\n  return c * 9 / 5 + 32;\n}"
      ],
      "tests": [
        {
          "args": [
            0
          ],
          "exp": 32
        },
        {
          "args": [
            100
          ],
          "exp": 212
        },
        {
          "args": [
            20
          ],
          "exp": 68
        }
      ]
    },
    {
      "title": "Área do círculo",
      "conceptIds": [
        "return",
        "multiplication",
        "expressions"
      ],
      "desc": "Receba o raio de um círculo e retorne sua área, arredondada para 2 casas decimais. Use Math.PI.",
      "sig": "function areaCirculo(r) { ... }",
      "starter": "function areaCirculo(r) {\n  // área = π × r × r — arredonde para 2 casas decimais\n\n}",
      "fn": "areaCirculo",
      "difficulty": "boss",
      "xp": 500,
      "skill": "calcular a área com Math.PI e arredondar para duas casas decimais",
      "hints": [
        "Pense na fórmula matemática da área do círculo.",
        "Use Math.PI, multiplique o raio por ele mesmo e arredonde para 2 casas.",
        "Monte a expressão π × r × r e use Math.round para manter somente duas casas decimais.",
        "function areaCirculo(r) {\n  return Math.round(Math.PI * r * r * 100) / 100;\n}"
      ],
      "tests": [
        {
          "args": [
            1
          ],
          "exp": 3.14
        },
        {
          "args": [
            2
          ],
          "exp": 12.57
        },
        {
          "args": [
            5
          ],
          "exp": 78.54
        },
        {
          "args": [
            0
          ],
          "exp": 0
        }
      ]
    }
  ]
};
