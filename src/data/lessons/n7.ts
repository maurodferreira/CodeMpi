import type { LevelLesson } from '../contentTypes';

export const N7_LESSON: LevelLesson = {
  "levelTag": "N7",
  "title": "Objetos",
  "subtitle": "Agora você vai aprender a organizar informações relacionadas, trabalhar com propriedades e usar objetos para representar dados do mundo real.",
  "rewardXp": 100,
  "steps": [
    {
      "id": "object-basics",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Um objeto reúne informações relacionadas",
      "body": "Um objeto permite guardar várias informações que pertencem à mesma coisa. Cada informação fica em uma propriedade formada por um nome e um valor.",
      "code": "const pessoa = {\n  nome: \"Ana\",\n  idade: 20\n};",
      "explanation": "Neste exemplo, pessoa é um objeto com duas propriedades: nome e idade. Em vez de espalhar essas informações em variáveis separadas, o objeto mantém tudo relacionado no mesmo lugar."
    },
    {
      "id": "object-properties",
      "type": "example",
      "eyebrow": "02 · PROPRIEDADES",
      "title": "Cada propriedade representa uma informação",
      "body": "As propriedades podem guardar textos, números, booleanos e outros valores que você já conhece. O nome da propriedade ajuda a entender o papel daquele valor.",
      "code": "const produto = {\n  nome: \"Teclado\",\n  preco: 120,\n  disponivel: true\n};",
      "explanation": "nome, preco e disponivel são propriedades do mesmo objeto. O objeto não cria um novo tipo de informação: ele organiza valores que você já aprendeu a usar."
    },
    {
      "id": "object-dot-access",
      "type": "example",
      "eyebrow": "03 · ACESSANDO",
      "title": "Leia uma propriedade com ponto",
      "body": "Quando você sabe qual propriedade quer acessar, use o nome do objeto, um ponto e o nome da propriedade.",
      "code": "const pessoa = {\n  nome: \"Ana\",\n  idade: 20\n};\n\npessoa.nome; // \"Ana\"\npessoa.idade; // 20",
      "explanation": "A notação de ponto é a forma mais direta de ler uma propriedade conhecida. O valor de pessoa.nome é \"Ana\", enquanto pessoa.idade é 20."
    },
    {
      "id": "object-bracket-access",
      "type": "example",
      "eyebrow": "04 · COLCHETES",
      "title": "Use colchetes quando o nome está em uma variável",
      "body": "Quando o nome da propriedade está guardado em uma variável, use a notação com colchetes. Assim, o programa usa o conteúdo dessa variável para decidir qual propriedade acessar.",
      "code": "const pessoa = {\n  nome: \"Ana\",\n  idade: 20\n};\n\nconst campo = \"idade\";\npessoa[campo]; // 20",
      "explanation": "Com pessoa.campo, o programa procuraria uma propriedade chamada campo. Com pessoa[campo], ele usa o valor de campo, que neste caso é \"idade\"."
    },
    {
      "id": "object-mutation",
      "type": "example",
      "eyebrow": "05 · ALTERANDO",
      "title": "Você também pode mudar uma propriedade",
      "body": "Uma propriedade existente pode receber um novo valor. O restante do objeto continua igual.",
      "code": "const pessoa = {\n  nome: \"Ana\",\n  idade: 20\n};\n\npessoa.idade = 21;",
      "explanation": "Atribuir um novo valor à propriedade altera o objeto. Esse mesmo padrão já apareceu com variáveis: agora você está atualizando um valor que está dentro de uma estrutura."
    },
    {
      "id": "object-add-delete",
      "type": "example",
      "eyebrow": "06 · ESTRUTURA",
      "title": "Propriedades também podem entrar e sair",
      "body": "Atribuir um valor a uma propriedade que ainda não existe cria essa propriedade. Para remover uma propriedade, use delete.",
      "code": "const usuario = {\n  nome: \"Ana\",\n  idade: 20\n};\n\nusuario.ativo = true;\ndelete usuario.idade;",
      "explanation": "Depois da primeira atribuição, ativo passa a fazer parte do objeto. Depois de delete, idade deixa de existir no objeto. Use essas operações quando a própria estrutura dos dados precisar mudar."
    },
    {
      "id": "object-collections",
      "type": "example",
      "eyebrow": "07 · OBJETOS + ARRAYS",
      "title": "Um array pode guardar e procurar vários objetos",
      "body": "Quando você tem muitas pessoas, produtos ou jogadores do mesmo tipo, pode colocar os objetos dentro de um array e percorrê-los com o for que aprendeu antes. Quando nenhum objeto atende à busca, null pode representar que não houve resultado.",
      "code": "const alunos = [\n  { id: 1, nome: \"Ana\", nota: 8 },\n  { id: 2, nome: \"Bruno\", nota: 6 }\n];\n\nfunction encontrarAluno(alunos, id) {\n  for (let i = 0; i < alunos.length; i++) {\n    if (alunos[i].id === id) return alunos[i];\n  }\n\n  return null;\n}",
      "explanation": "alunos[i] é um objeto. Você pode acessar propriedades como alunos[i].nome e também comparar uma propriedade, como alunos[i].id, para encontrar o objeto certo. O return null representa o caso em que a busca terminou sem encontrar um resultado."
    },
    {
      "id": "object-validation",
      "type": "example",
      "eyebrow": "08 · VALIDANDO",
      "title": "Objetos também podem ser validados por suas propriedades",
      "body": "As regras de um programa muitas vezes dependem de mais de um dado do mesmo objeto. Leia as propriedades e combine as condições que precisam ser verdadeiras.",
      "code": "function produtoValido(produto) {\n  return produto.preco > 0 && produto.estoque >= 0;\n}\n\nprodutoValido({ preco: 50, estoque: 3 }); // true",
      "explanation": "A função não pergunta sobre o objeto inteiro de uma vez. Ela usa as propriedades relevantes e transforma as regras do produto em uma resposta booleana."
    },
    {
      "id": "object-functions",
      "type": "example",
      "eyebrow": "09 · FUNÇÕES",
      "title": "Funções podem transformar dados de um objeto",
      "body": "Uma função pode receber um objeto, ler suas propriedades e devolver um resultado calculado. Isso permite criar tarefas reutilizáveis para um tipo de dado.",
      "code": "function calcularTotal(produto) {\n  return produto.preco * produto.quantidade;\n}\n\ncalcularTotal({ preco: 50, quantidade: 3 }); // 150",
      "explanation": "A função recebe um único objeto, mas consegue usar várias informações dele. Isso deixa a chamada mais organizada quando os dados pertencem à mesma entidade."
    },
    {
      "id": "object-quiz",
      "type": "quiz",
      "eyebrow": "10 · TESTE RÁPIDO",
      "title": "Qual propriedade será acessada?",
      "body": "Observe a variável campo e acompanhe o acesso por colchetes antes de escolher o resultado.",
      "quiz": {
        "question": "Qual valor será retornado por obterPropriedade({ nome: \"Ana\", idade: 20 }, \"idade\")?",
        "options": [
          "\"Ana\"",
          "20",
          "idade",
          "null"
        ],
        "answer": 1,
        "explanation": "A variável campo recebe o texto \"idade\". Com objeto[campo], o acesso é feito à propriedade idade, cujo valor é 20."
      },
      "code": "function obterPropriedade(objeto, campo) {\n  return objeto[campo];\n}"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "11 · VOCÊ ESTÁ PRONTO",
      "title": "Agora pense em dados, não só em valores",
      "body": "Você já sabe criar objetos, acessar propriedades, usar colchetes, alterar, adicionar e remover dados, validar objetos e percorrer arrays de objetos. As missões agora vão transformar essas ideias em problemas de cadastro, busca, produtos e pedidos.",
      "code": "function processarPedido(produto, quantidade) {\n  // use o objeto para validar e atualizar o pedido\n}",
      "explanation": "N7 marca a passagem de valores isolados para estruturas que representam entidades. O objetivo não é decorar sintaxe de objetos, mas aprender a organizar e manipular dados de forma clara."
    }
  ]
};
