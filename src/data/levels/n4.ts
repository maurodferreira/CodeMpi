import type { Level } from '../contentTypes';

export const N4_LEVEL: Level = {
  "name": "Strings",
  "tag": "N4",
  "exercises": [
    {
      "title": "Tamanho do texto",
      "conceptIds": [
        "strings",
        "stringLength"
      ],
      "desc": "Retorne quantos caracteres existem em texto.",
      "sig": "function tamanho(texto) { ... }",
      "starter": "function tamanho(texto) {\n  // descubra quantos caracteres existem\n}",
      "fn": "tamanho",
      "difficulty": "facil",
      "xp": 120,
      "skill": "usar length para descobrir o tamanho de uma string",
      "hints": [
        "Pense em qual informação a própria string fornece sobre seu tamanho.",
        "Use a propriedade length do texto.",
        "Retorne diretamente texto.length.",
        "function tamanho(texto) {\n  return texto.length;\n}"
      ],
      "tests": [
        {
          "args": [
            "CodeMpi"
          ],
          "exp": 7
        },
        {
          "args": [
            ""
          ],
          "exp": 0
        },
        {
          "args": [
            "programar"
          ],
          "exp": 9
        }
      ]
    },
    {
      "title": "Primeira letra",
      "conceptIds": [
        "strings",
        "stringIndex"
      ],
      "desc": "Retorne o primeiro caractere de texto.",
      "sig": "function primeiraLetra(texto) { ... }",
      "starter": "function primeiraLetra(texto) {\n  // acesse a primeira posição\n}",
      "fn": "primeiraLetra",
      "difficulty": "facil",
      "xp": 120,
      "skill": "acessar o primeiro caractere usando índice",
      "hints": [
        "Lembre que a primeira posição começa em 0.",
        "Use os colchetes para acessar o índice 0.",
        "A primeira letra está em texto[0].",
        "function primeiraLetra(texto) {\n  return texto[0];\n}"
      ],
      "tests": [
        {
          "args": [
            "CodeMpi"
          ],
          "exp": "C"
        },
        {
          "args": [
            "JavaScript"
          ],
          "exp": "J"
        },
        {
          "args": [
            "a"
          ],
          "exp": "a"
        }
      ]
    },
    {
      "title": "Última letra",
      "conceptIds": [
        "strings",
        "stringLength",
        "stringIndex"
      ],
      "desc": "Retorne o último caractere de texto.",
      "sig": "function ultimaLetra(texto) { ... }",
      "starter": "function ultimaLetra(texto) {\n  // encontre o último índice\n}",
      "fn": "ultimaLetra",
      "difficulty": "facil",
      "xp": 140,
      "skill": "combinar length e índice para acessar a última posição",
      "hints": [
        "O último índice não é igual ao tamanho da string.",
        "Comece pensando em length e lembre que a contagem dos índices começa em 0.",
        "O último índice é texto.length - 1; use-o entre colchetes.",
        "function ultimaLetra(texto) {\n  return texto[texto.length - 1];\n}"
      ],
      "tests": [
        {
          "args": [
            "CodeMpi"
          ],
          "exp": "i"
        },
        {
          "args": [
            "JavaScript"
          ],
          "exp": "t"
        },
        {
          "args": [
            "a"
          ],
          "exp": "a"
        }
      ]
    },
    {
      "title": "Tudo em maiúsculas",
      "conceptIds": [
        "strings",
        "stringCase"
      ],
      "desc": "Retorne texto com todas as letras em maiúsculas.",
      "sig": "function maiusculas(texto) { ... }",
      "starter": "function maiusculas(texto) {\n  // transforme o texto\n}",
      "fn": "maiusculas",
      "difficulty": "medio",
      "xp": 160,
      "skill": "transformar uma string usando toUpperCase",
      "hints": [
        "Pense em qual transformação da aula deixa todas as letras em caixa alta.",
        "Use o método toUpperCase na string.",
        "Chame texto.toUpperCase() e retorne o resultado.",
        "function maiusculas(texto) {\n  return texto.toUpperCase();\n}"
      ],
      "tests": [
        {
          "args": [
            "codempi"
          ],
          "exp": "CODEMPI"
        },
        {
          "args": [
            "Code Mpi"
          ],
          "exp": "CODE MPI"
        },
        {
          "args": [
            ""
          ],
          "exp": ""
        }
      ]
    },
    {
      "title": "Tudo em minúsculas",
      "conceptIds": [
        "strings",
        "stringCase"
      ],
      "desc": "Retorne texto com todas as letras em minúsculas.",
      "sig": "function minusculas(texto) { ... }",
      "starter": "function minusculas(texto) {\n  // transforme o texto\n}",
      "fn": "minusculas",
      "difficulty": "medio",
      "xp": 160,
      "skill": "transformar uma string usando toLowerCase",
      "hints": [
        "Agora pense na transformação oposta à missão anterior.",
        "Use o método toLowerCase na string.",
        "Chame texto.toLowerCase() e retorne o resultado.",
        "function minusculas(texto) {\n  return texto.toLowerCase();\n}"
      ],
      "tests": [
        {
          "args": [
            "CODEMPI"
          ],
          "exp": "codempi"
        },
        {
          "args": [
            "Code MPI"
          ],
          "exp": "code mpi"
        },
        {
          "args": [
            ""
          ],
          "exp": ""
        }
      ]
    },
    {
      "title": "Contando um caractere",
      "conceptIds": [
        "strings",
        "stringIteration",
        "counters"
      ],
      "desc": "Retorne quantas vezes o caractere alvo aparece em texto. A comparação deve ser exata.",
      "sig": "function contarCaractere(texto, alvo) { ... }",
      "starter": "function contarCaractere(texto, alvo) {\n  let quantidade = 0;\n\n  // percorra o texto e conte o alvo\n}",
      "fn": "contarCaractere",
      "difficulty": "medio",
      "xp": 240,
      "skill": "percorrer uma string e usar um contador para contar ocorrências",
      "hints": [
        "Pense no mesmo padrão de contador que você usou no N3.",
        "Percorra os índices de 0 até texto.length e aumente o contador quando o caractere atual for igual ao alvo.",
        "Dentro do for, compare texto[i] com alvo usando === e faça quantidade++ quando forem iguais.",
        "function contarCaractere(texto, alvo) {\n  let quantidade = 0;\n\n  for (let i = 0; i < texto.length; i++) {\n    if (texto[i] === alvo) quantidade++;\n  }\n\n  return quantidade;\n}"
      ],
      "tests": [
        {
          "args": [
            "banana",
            "a"
          ],
          "exp": 3
        },
        {
          "args": [
            "CodeMpi",
            "o"
          ],
          "exp": 1
        },
        {
          "args": [
            "banana",
            "x"
          ],
          "exp": 0
        },
        {
          "args": [
            "",
            "a"
          ],
          "exp": 0
        }
      ]
    },
    {
      "title": "Inverter texto",
      "conceptIds": [
        "strings",
        "stringIteration"
      ],
      "desc": "Retorne texto escrito de trás para frente.",
      "sig": "function inverter(texto) { ... }",
      "starter": "function inverter(texto) {\n  let resultado = \"\";\n\n  // construa o texto invertido\n}",
      "fn": "inverter",
      "difficulty": "dificil",
      "xp": 320,
      "skill": "percorrer uma string e construir um novo texto caractere por caractere",
      "hints": [
        "Pense em construir uma segunda string enquanto percorre a original.",
        "Para inverter, visite o texto do último índice até o primeiro.",
        "Comece no índice texto.length - 1, diminua até 0 e acrescente texto[i] a resultado.",
        "function inverter(texto) {\n  let resultado = \"\";\n\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado += texto[i];\n  }\n\n  return resultado;\n}"
      ],
      "tests": [
        {
          "args": [
            "casa"
          ],
          "exp": "asac"
        },
        {
          "args": [
            "CodeMpi"
          ],
          "exp": "ipMedoC"
        },
        {
          "args": [
            ""
          ],
          "exp": ""
        },
        {
          "args": [
            "a"
          ],
          "exp": "a"
        }
      ]
    },
    {
      "title": "Substituir ocorrências",
      "conceptIds": [
        "strings",
        "stringReplacement"
      ],
      "desc": "Retorne texto com todas as ocorrências de alvo substituídas por novo.",
      "sig": "function substituir(texto, alvo, novo) { ... }",
      "starter": "function substituir(texto, alvo, novo) {\n  // substitua todas as ocorrências\n}",
      "fn": "substituir",
      "difficulty": "dificil",
      "xp": 320,
      "skill": "substituir todas as ocorrências de um trecho em uma string",
      "hints": [
        "Pense no método que a aula apresentou para trocar partes do texto.",
        "Use replaceAll para informar o que deve sair e o que deve entrar.",
        "Retorne texto.replaceAll(alvo, novo).",
        "function substituir(texto, alvo, novo) {\n  return texto.replaceAll(alvo, novo);\n}"
      ],
      "tests": [
        {
          "args": [
            "banana",
            "a",
            "o"
          ],
          "exp": "bonono"
        },
        {
          "args": [
            "CodeMpi",
            "M",
            "m"
          ],
          "exp": "Codempi"
        },
        {
          "args": [
            "aaaa",
            "aa",
            "b"
          ],
          "exp": "bb"
        },
        {
          "args": [
            "abc",
            "x",
            "y"
          ],
          "exp": "abc"
        }
      ]
    },
    {
      "title": "Textos iguais",
      "conceptIds": [
        "strings",
        "stringComparison"
      ],
      "desc": "Retorne true somente quando textoA e textoB forem exatamente iguais.",
      "sig": "function iguais(textoA, textoB) { ... }",
      "starter": "function iguais(textoA, textoB) {\n  // faça uma comparação exata\n}",
      "fn": "iguais",
      "difficulty": "medio",
      "xp": 340,
      "skill": "comparar duas strings usando igualdade exata",
      "hints": [
        "Pense no operador usado na aula para verificar igualdade exata.",
        "Use === entre os dois textos.",
        "A comparação direta é textoA === textoB.",
        "function iguais(textoA, textoB) {\n  return textoA === textoB;\n}"
      ],
      "tests": [
        {
          "args": [
            "CodeMpi",
            "CodeMpi"
          ],
          "exp": true
        },
        {
          "args": [
            "CodeMpi",
            "codempi"
          ],
          "exp": false
        },
        {
          "args": [
            "abc",
            "abcd"
          ],
          "exp": false
        },
        {
          "args": [
            "",
            ""
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "BOSS · É palíndromo?",
      "conceptIds": [
        "strings",
        "stringIteration",
        "stringComparison",
        "palindrome"
      ],
      "desc": "Retorne true se texto for igual ao próprio texto escrito de trás para frente. Considere apenas textos em minúsculas e sem espaços.",
      "sig": "function ehPalindromo(texto) { ... }",
      "starter": "function ehPalindromo(texto) {\n  // compare o texto com sua versão invertida\n}",
      "fn": "ehPalindromo",
      "difficulty": "boss",
      "xp": 550,
      "skill": "combinar percurso, construção de string e comparação",
      "hints": [
        "Pense no que precisa ser verdade para um texto ser palíndromo.",
        "Construa uma versão invertida do texto usando o padrão da missão anterior.",
        "Percorra do último caractere ao primeiro, monte o invertido e compare com texto usando ===.",
        "function ehPalindromo(texto) {\n  let invertido = \"\";\n\n  for (let i = texto.length - 1; i >= 0; i--) {\n    invertido += texto[i];\n  }\n\n  return texto === invertido;\n}"
      ],
      "tests": [
        {
          "args": [
            "arara"
          ],
          "exp": true
        },
        {
          "args": [
            "radar"
          ],
          "exp": true
        },
        {
          "args": [
            "casa"
          ],
          "exp": false
        },
        {
          "args": [
            "codempi"
          ],
          "exp": false
        },
        {
          "args": [
            "a"
          ],
          "exp": true
        },
        {
          "args": [
            ""
          ],
          "exp": true
        }
      ]
    }
  ]
};
