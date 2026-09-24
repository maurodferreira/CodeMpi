import type { Level } from '../contentTypes';

export const N7_LEVEL: Level = {
  "name": "Objetos",
  "tag": "N7",
  "exercises": [
    {
      "title": "Acessar o nome",
      "conceptIds": [
        "objects",
        "objectProperties",
        "objectAccess"
      ],
      "desc": "Receba um objeto pessoa e retorne o valor da propriedade nome.",
      "sig": "function obterNome(pessoa) { ... }",
      "starter": "function obterNome(pessoa) {\n  // acesse a propriedade nome\n}",
      "fn": "obterNome",
      "difficulty": "facil",
      "xp": 120,
      "skill": "acessar uma propriedade de um objeto",
      "hints": [
        "Pense em como chegar até a informação guardada dentro de pessoa.",
        "Use o nome do objeto seguido de ponto e do nome da propriedade.",
        "Acesse pessoa.nome e devolva o valor com return.",
        "function obterNome(pessoa) {\n  return pessoa.nome;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Ana",
              "idade": 20
            }
          ],
          "exp": "Ana"
        },
        {
          "args": [
            {
              "nome": "Bruno",
              "idade": 25
            }
          ],
          "exp": "Bruno"
        },
        {
          "args": [
            {
              "nome": "Carla",
              "idade": 18
            }
          ],
          "exp": "Carla"
        }
      ]
    },
    {
      "title": "Acessar uma propriedade",
      "conceptIds": [
        "objects",
        "objectProperties",
        "objectBracketAccess"
      ],
      "desc": "Receba um objeto e o nome de uma propriedade e retorne o valor dessa propriedade. Use a variável campo para fazer o acesso.",
      "sig": "function obterPropriedade(objeto, campo) { ... }",
      "starter": "function obterPropriedade(objeto, campo) {\n  // use o valor de campo para acessar a propriedade\n}",
      "fn": "obterPropriedade",
      "difficulty": "facil",
      "xp": 140,
      "skill": "acessar propriedades com notação de colchetes",
      "hints": [
        "Desta vez, o nome da propriedade está dentro de uma variável.",
        "A notação com ponto usa um nome fixo; para usar uma variável, coloque-a entre colchetes.",
        "Use objeto[campo] e retorne o resultado.",
        "function obterPropriedade(objeto, campo) {\n  return objeto[campo];\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Ana",
              "idade": 20
            },
            "idade"
          ],
          "exp": 20
        },
        {
          "args": [
            {
              "nome": "Bruno",
              "cidade": "Londrina"
            },
            "cidade"
          ],
          "exp": "Londrina"
        },
        {
          "args": [
            {
              "ativo": true,
              "nome": "Carla"
            },
            "ativo"
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Alterar uma propriedade",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectMutation"
      ],
      "desc": "Receba uma pessoa e uma nova idade. Atualize a propriedade idade e retorne o próprio objeto.",
      "sig": "function atualizarIdade(pessoa, novaIdade) { ... }",
      "starter": "function atualizarIdade(pessoa, novaIdade) {\n  // atualize idade\n}",
      "fn": "atualizarIdade",
      "difficulty": "medio",
      "xp": 180,
      "skill": "alterar uma propriedade existente",
      "hints": [
        "A propriedade já existe no objeto. Você só precisa trocar seu valor.",
        "Acesse pessoa.idade no lado esquerdo de uma atribuição.",
        "Faça pessoa.idade = novaIdade e depois retorne pessoa.",
        "function atualizarIdade(pessoa, novaIdade) {\n  pessoa.idade = novaIdade;\n  return pessoa;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Ana",
              "idade": 20
            },
            21
          ],
          "exp": {
            "nome": "Ana",
            "idade": 21
          }
        },
        {
          "args": [
            {
              "nome": "Bruno",
              "idade": 30
            },
            31
          ],
          "exp": {
            "nome": "Bruno",
            "idade": 31
          }
        },
        {
          "args": [
            {
              "nome": "Carla",
              "idade": 17
            },
            18
          ],
          "exp": {
            "nome": "Carla",
            "idade": 18
          }
        }
      ]
    },
    {
      "title": "Adicionar uma propriedade",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectMutation",
        "objectAddition"
      ],
      "desc": "Receba uma pessoa e um valor booleano. Adicione a propriedade ativo e retorne o objeto.",
      "sig": "function definirAtivo(pessoa, ativo) { ... }",
      "starter": "function definirAtivo(pessoa, ativo) {\n  // adicione a propriedade ativo\n}",
      "fn": "definirAtivo",
      "difficulty": "medio",
      "xp": 190,
      "skill": "adicionar uma nova propriedade a um objeto",
      "hints": [
        "Uma propriedade nova pode ser criada atribuindo um valor a um nome que ainda não existe.",
        "Atribua o parâmetro ativo à propriedade ativo do objeto.",
        "Faça pessoa.ativo = ativo e depois retorne pessoa.",
        "function definirAtivo(pessoa, ativo) {\n  pessoa.ativo = ativo;\n  return pessoa;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Ana"
            },
            true
          ],
          "exp": {
            "nome": "Ana",
            "ativo": true
          }
        },
        {
          "args": [
            {
              "nome": "Bruno",
              "idade": 25
            },
            false
          ],
          "exp": {
            "nome": "Bruno",
            "idade": 25,
            "ativo": false
          }
        },
        {
          "args": [
            {
              "nome": "Carla",
              "ativo": false
            },
            true
          ],
          "exp": {
            "nome": "Carla",
            "ativo": true
          }
        }
      ]
    },
    {
      "title": "Remover uma propriedade",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectMutation",
        "objectDeletion"
      ],
      "desc": "Receba um usuário, remova a propriedade senha e retorne o objeto sem essa propriedade.",
      "sig": "function removerSenha(usuario) { ... }",
      "starter": "function removerSenha(usuario) {\n  // remova a propriedade senha\n}",
      "fn": "removerSenha",
      "difficulty": "medio",
      "xp": 200,
      "skill": "remover uma propriedade usando delete",
      "hints": [
        "Existe um operador específico para remover uma propriedade de um objeto.",
        "Use delete antes de usuario.senha.",
        "Faça delete usuario.senha e depois retorne usuario.",
        "function removerSenha(usuario) {\n  delete usuario.senha;\n  return usuario;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Ana",
              "senha": "abc123",
              "idade": 20
            }
          ],
          "exp": {
            "nome": "Ana",
            "idade": 20
          }
        },
        {
          "args": [
            {
              "nome": "Bruno",
              "senha": "xyz",
              "ativo": true
            }
          ],
          "exp": {
            "nome": "Bruno",
            "ativo": true
          }
        },
        {
          "args": [
            {
              "nome": "Carla",
              "idade": 18,
              "senha": "segredo"
            }
          ],
          "exp": {
            "nome": "Carla",
            "idade": 18
          }
        }
      ]
    },
    {
      "title": "Objeto válido",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectValidation",
        "booleanFunctions"
      ],
      "desc": "Retorne true somente quando o produto tiver preço maior que zero e estoque maior ou igual a zero.",
      "sig": "function produtoValido(produto) { ... }",
      "starter": "function produtoValido(produto) {\n  // valide preço e estoque\n}",
      "fn": "produtoValido",
      "difficulty": "medio",
      "xp": 220,
      "skill": "transformar regras sobre propriedades em uma função booleana",
      "hints": [
        "A validade depende de duas regras ao mesmo tempo.",
        "O preço precisa ser maior que zero e o estoque não pode ser negativo.",
        "Combine produto.preco > 0 e produto.estoque >= 0 com &&.",
        "function produtoValido(produto) {\n  return produto.preco > 0 && produto.estoque >= 0;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "preco": 100,
              "estoque": 5
            }
          ],
          "exp": true
        },
        {
          "args": [
            {
              "preco": 0,
              "estoque": 5
            }
          ],
          "exp": false
        },
        {
          "args": [
            {
              "preco": 50,
              "estoque": -1
            }
          ],
          "exp": false
        },
        {
          "args": [
            {
              "preco": 1,
              "estoque": 0
            }
          ],
          "exp": true
        }
      ]
    },
    {
      "title": "Total do produto",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectFunctions",
        "multiplication"
      ],
      "desc": "Receba um produto com preco e quantidade e retorne o valor total da compra.",
      "sig": "function calcularTotal(produto) { ... }",
      "starter": "function calcularTotal(produto) {\n  // multiplique preço pela quantidade\n}",
      "fn": "calcularTotal",
      "difficulty": "medio",
      "xp": 240,
      "skill": "usar várias propriedades de um objeto em um cálculo",
      "hints": [
        "O total depende de dois valores guardados no mesmo objeto.",
        "A fórmula é preço multiplicado pela quantidade.",
        "Retorne produto.preco * produto.quantidade.",
        "function calcularTotal(produto) {\n  return produto.preco * produto.quantidade;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "preco": 50,
              "quantidade": 3
            }
          ],
          "exp": 150
        },
        {
          "args": [
            {
              "preco": 25,
              "quantidade": 4
            }
          ],
          "exp": 100
        },
        {
          "args": [
            {
              "preco": 80,
              "quantidade": 0
            }
          ],
          "exp": 0
        }
      ]
    },
    {
      "title": "Contar usuários ativos",
      "conceptIds": [
        "objects",
        "objectCollections",
        "objectIteration",
        "counters",
        "conditionals"
      ],
      "desc": "Receba uma lista de usuários e conte quantos estão com a propriedade ativo igual a true.",
      "sig": "function contarAtivos(usuarios) { ... }",
      "starter": "function contarAtivos(usuarios) {\n  let quantidade = 0;\n\n  // percorra os usuários e conte os ativos\n}",
      "fn": "contarAtivos",
      "difficulty": "dificil",
      "xp": 320,
      "skill": "percorrer arrays de objetos usando propriedades e contador",
      "hints": [
        "Você já aprendeu a contar valores no N3. Agora cada valor é um objeto.",
        "Percorra o array com for e verifique usuarios[i].ativo.",
        "Dentro do laço, incremente quantidade quando usuarios[i].ativo === true; depois retorne quantidade.",
        "function contarAtivos(usuarios) {\n  let quantidade = 0;\n\n  for (let i = 0; i < usuarios.length; i++) {\n    if (usuarios[i].ativo === true) quantidade++;\n  }\n\n  return quantidade;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              {
                "nome": "Ana",
                "ativo": true
              },
              {
                "nome": "Bruno",
                "ativo": false
              },
              {
                "nome": "Carla",
                "ativo": true
              }
            ]
          ],
          "exp": 2
        },
        {
          "args": [
            [
              {
                "nome": "Ana",
                "ativo": false
              },
              {
                "nome": "Bruno",
                "ativo": false
              }
            ]
          ],
          "exp": 0
        },
        {
          "args": [
            []
          ],
          "exp": 0
        },
        {
          "args": [
            [
              {
                "nome": "Ana",
                "ativo": true
              }
            ]
          ],
          "exp": 1
        }
      ]
    },
    {
      "title": "Encontrar usuário",
      "conceptIds": [
        "objects",
        "objectCollections",
        "objectSearch",
        "objectAccess",
        "loops",
        "conditionals",
        "nullValue"
      ],
      "desc": "Receba uma lista de usuários e um id. Retorne o primeiro usuário com esse id. Se nenhum for encontrado, retorne null.",
      "sig": "function encontrarUsuario(usuarios, id) { ... }",
      "starter": "function encontrarUsuario(usuarios, id) {\n  // procure pelo id\n}",
      "fn": "encontrarUsuario",
      "difficulty": "dificil",
      "xp": 380,
      "skill": "buscar um objeto dentro de uma lista e tratar o caso de ausência",
      "hints": [
        "Percorra os usuários como você fez no N3, mas agora compare uma propriedade.",
        "Quando encontrar usuarios[i].id igual ao id procurado, retorne esse objeto imediatamente.",
        "Use um for, compare usuarios[i].id === id, retorne usuarios[i] no primeiro match e retorne null depois do laço.",
        "function encontrarUsuario(usuarios, id) {\n  for (let i = 0; i < usuarios.length; i++) {\n    if (usuarios[i].id === id) return usuarios[i];\n  }\n\n  return null;\n}"
      ],
      "tests": [
        {
          "args": [
            [
              {
                "id": 1,
                "nome": "Ana"
              },
              {
                "id": 2,
                "nome": "Bruno"
              }
            ],
            2
          ],
          "exp": {
            "id": 2,
            "nome": "Bruno"
          }
        },
        {
          "args": [
            [
              {
                "id": 10,
                "nome": "Carla"
              },
              {
                "id": 20,
                "nome": "Diego"
              }
            ],
            10
          ],
          "exp": {
            "id": 10,
            "nome": "Carla"
          }
        },
        {
          "args": [
            [
              {
                "id": 1,
                "nome": "Ana"
              }
            ],
            99
          ],
          "exp": null
        },
        {
          "args": [
            [],
            1
          ],
          "exp": null
        }
      ]
    },
    {
      "title": "BOSS · Processar pedido",
      "conceptIds": [
        "objects",
        "objectAccess",
        "objectMutation",
        "objectValidation",
        "objectFunctions",
        "parameters",
        "functionComposition",
        "earlyReturn",
        "conditionals",
        "multiplication"
      ],
      "desc": "Valide a quantidade, calcule o total usando uma função auxiliar e atualize estoque, vendas e totalUltimoPedido. Para uma quantidade inválida, retorne null sem alterar o produto.",
      "sig": "function processarPedido(produto, quantidade) { ... }",
      "starter": "function pedidoValido(produto, quantidade) {\n  // a quantidade precisa ser positiva e não pode passar do estoque\n}\n\nfunction calcularValorPedido(produto, quantidade) {\n  // calcule o valor total\n}\n\nfunction processarPedido(produto, quantidade) {\n  // valide, calcule e atualize o produto\n}",
      "fn": "processarPedido",
      "difficulty": "boss",
      "xp": 550,
      "skill": "combinar objetos, validação, composição de funções e atualização de estado",
      "hints": [
        "Quebre em três etapas: validar a quantidade, calcular o valor e atualizar o objeto.",
        "Crie pedidoValido e calcularValorPedido como funções auxiliares e use as duas dentro de processarPedido.",
        "Retorne null quando quantidade <= 0 ou quantidade > produto.estoque; depois calcule o total, reduza estoque, some em vendas, grave totalUltimoPedido e retorne produto.",
        "function pedidoValido(produto, quantidade) {\n  return quantidade > 0 && quantidade <= produto.estoque;\n}\n\nfunction calcularValorPedido(produto, quantidade) {\n  return produto.preco * quantidade;\n}\n\nfunction processarPedido(produto, quantidade) {\n  if (pedidoValido(produto, quantidade) === false) return null;\n\n  const total = calcularValorPedido(produto, quantidade);\n  produto.estoque = produto.estoque - quantidade;\n  produto.vendas = produto.vendas + quantidade;\n  produto.totalUltimoPedido = total;\n\n  return produto;\n}"
      ],
      "tests": [
        {
          "args": [
            {
              "nome": "Mouse",
              "preco": 100,
              "estoque": 5,
              "vendas": 0
            },
            2
          ],
          "exp": {
            "nome": "Mouse",
            "preco": 100,
            "estoque": 3,
            "vendas": 2,
            "totalUltimoPedido": 200
          }
        },
        {
          "args": [
            {
              "nome": "Teclado",
              "preco": 80,
              "estoque": 10,
              "vendas": 3
            },
            4
          ],
          "exp": {
            "nome": "Teclado",
            "preco": 80,
            "estoque": 6,
            "vendas": 7,
            "totalUltimoPedido": 320
          }
        },
        {
          "args": [
            {
              "nome": "Fone",
              "preco": 50,
              "estoque": 5,
              "vendas": 1
            },
            0
          ],
          "exp": null
        },
        {
          "args": [
            {
              "nome": "Webcam",
              "preco": 120,
              "estoque": 3,
              "vendas": 2
            },
            4
          ],
          "exp": null
        },
        {
          "args": [
            {
              "nome": "Monitor",
              "preco": 200,
              "estoque": 5,
              "vendas": 0
            },
            5
          ],
          "exp": {
            "nome": "Monitor",
            "preco": 200,
            "estoque": 0,
            "vendas": 5,
            "totalUltimoPedido": 1000
          }
        }
      ]
    }
  ]
};
