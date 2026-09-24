export interface ExerciseTest {
    args: unknown[];
    exp: unknown;
}

export interface Exercise {
    title: string;
    desc: string;
    sig: string;
    starter: string;
    fn: string;
    difficulty: "facil" | "medio" | "dificil" | "boss";
    xp: number;
    skill: string;
    conceptIds?: string[];
    hints: string[];
    tests: ExerciseTest[];
}

export interface Level {
    name: string;
    tag: string;
    exercises: Exercise[] | null;
    count?: number;
    topics?: string;
}

export const LEVELS: Level[] = [
    {
        name: "Variáveis e Operadores", tag: "N1", exercises: [
            {
                title: "Soma de dois números", conceptIds: ["return","addition"], desc: "Complete a função para que ela retorne a soma de a e b.", sig: "function somar(a, b) { ... }", starter: "function somar(a, b) {\n  // escreva seu código aqui\n\n}", fn: "somar", difficulty: "facil", xp: 100, skill: "devolver um valor usando return e somar os parâmetros",
                hints: ["Você precisa usar a palavra-chave return dentro da função.", "O valor retornado deve ser a soma dos dois parâmetros recebidos.", "return a + b;"],
                tests: [{ args: [2, 3], exp: 5 }, { args: [-1, 1], exp: 0 }, { args: [10, 15], exp: 25 }]
            },
            {
                title: "Subtração de dois números", conceptIds: ["return","subtraction"], desc: "Retorne o resultado de a menos b.", sig: "function subtrair(a, b) { ... }", starter: "function subtrair(a, b) {\n\n}", fn: "subtrair", difficulty: "facil", xp: 100, skill: "usar o operador - para subtrair o segundo parâmetro do primeiro",
                hints: ["Use return para devolver o resultado da subtração.", "O resultado é o primeiro parâmetro menos o segundo.", "return a - b;"],
                tests: [{ args: [10, 4], exp: 6 }, { args: [5, 5], exp: 0 }, { args: [3, 10], exp: -7 }]
            },
            {
                title: "Dobro de um número", conceptIds: ["return","multiplication"], desc: "Retorne o dobro (n × 2) do número recebido.", sig: "function dobro(n) { ... }", starter: "function dobro(n) {\n\n}", fn: "dobro", difficulty: "facil", xp: 100, skill: "usar o operador * para multiplicar o valor por 2",
                hints: ["Multiplique o número por 2.", "Use o operador * para multiplicação.", "return n * 2;"],
                tests: [{ args: [4], exp: 8 }, { args: [0], exp: 0 }, { args: [-3], exp: -6 }]
            },
            {
                title: "Multiplicação de dois números", conceptIds: ["return","multiplication"], desc: "Retorne o produto de a e b.", sig: "function multiplicar(a, b) { ... }", starter: "function multiplicar(a, b) {\n\n}", fn: "multiplicar", difficulty: "medio", xp: 200, skill: "usar o operador * entre dois valores",
                hints: ["Use o operador * entre os dois parâmetros.", "O resultado é a multiplicação de a por b.", "return a * b;"],
                tests: [{ args: [3, 4], exp: 12 }, { args: [0, 9], exp: 0 }, { args: [-2, 5], exp: -10 }]
            },
            {
                title: "Divisão de dois números", conceptIds: ["return","division"], desc: "Retorne o resultado de a dividido por b. O resultado pode ser decimal.", sig: "function dividir(a, b) { ... }", starter: "function dividir(a, b) {\n\n}", fn: "dividir", difficulty: "medio", xp: 200, skill: "usar o operador / para dividir dois valores",
                hints: ["Use o operador / para dividir.", "O resultado pode ser um número decimal, isso é esperado.", "return a / b;"],
                tests: [{ args: [10, 2], exp: 5 }, { args: [7, 2], exp: 3.5 }, { args: [9, 3], exp: 3 }]
            },
            {
                title: "Triplo de um número", conceptIds: ["return","multiplication"], desc: "Retorne o triplo (n × 3) do número recebido.", sig: "function triplo(n) { ... }", starter: "function triplo(n) {\n\n}", fn: "triplo", difficulty: "medio", xp: 200, skill: "usar o operador * para multiplicar o valor por 3",
                hints: ["Multiplique o número por 3.", "É parecido com o exercício do dobro, mas com outro fator.", "return n * 3;"],
                tests: [{ args: [2], exp: 6 }, { args: [0], exp: 0 }, { args: [-4], exp: -12 }]
            },
            {
                title: "Média de três números", conceptIds: ["return","addition","division","expressions"], desc: "Receba três números e retorne a média aritmética entre eles.", sig: "function media3(a, b, c) { ... }", starter: "function media3(a, b, c) {\n  // some os três e divida por 3\n\n}", fn: "media3", difficulty: "dificil", xp: 350, skill: "combinar soma e divisão para calcular uma média",
                hints: ["Some os três números antes de dividir.", "Divida a soma total por 3.", "return (a + b + c) / 3;"],
                tests: [{ args: [3, 6, 9], exp: 6 }, { args: [10, 10, 10], exp: 10 }, { args: [1, 2, 3], exp: 2 }]
            },
            {
                title: "Resto da divisão", conceptIds: ["return","remainder"], desc: "Retorne o resto da divisão de a por b.", sig: "function resto(a, b) { ... }", starter: "function resto(a, b) {\n\n}", fn: "resto", difficulty: "dificil", xp: 350, skill: "usar o operador % para obter o resto da divisão",
                hints: ["Use o operador % para obter o resto de uma divisão.", "O resto é o que sobra depois de dividir a por b o máximo de vezes possível.", "return a % b;"],
                tests: [{ args: [10, 3], exp: 1 }, { args: [20, 5], exp: 0 }, { args: [7, 2], exp: 1 }]
            },
            {
                title: "Celsius para Fahrenheit", conceptIds: ["return","multiplication","division","addition","expressions"], desc: "Receba uma temperatura em Celsius e retorne o equivalente em Fahrenheit.", sig: "function celsiusParaFahrenheit(c) { ... }", starter: "function celsiusParaFahrenheit(c) {\n  // Fahrenheit = Celsius * 9/5 + 32\n\n}", fn: "celsiusParaFahrenheit", difficulty: "dificil", xp: 350, skill: "aplicar a fórmula Celsius × 9 / 5 + 32 na ordem correta",
                hints: ["A fórmula envolve multiplicar, dividir e depois somar.", "Fahrenheit = Celsius × 9 / 5 + 32.", "return c * 9 / 5 + 32;"],
                tests: [{ args: [0], exp: 32 }, { args: [100], exp: 212 }, { args: [20], exp: 68 }]
            },
            {
                title: "Área do círculo", conceptIds: ["return","multiplication","expressions"], desc: "Receba o raio de um círculo e retorne sua área, arredondada para 2 casas decimais. Use Math.PI.", sig: "function areaCirculo(r) { ... }", starter: "function areaCirculo(r) {\n  // área = π × r × r — arredonde para 2 casas decimais\n\n}", fn: "areaCirculo", difficulty: "boss", xp: 500, skill: "calcular a área com Math.PI e arredondar para duas casas decimais",
                hints: ["A fórmula da área do círculo é π × r × r.", "Use Math.PI para o valor de π.", "return Math.round(Math.PI * r * r * 100) / 100;"],
                tests: [{ args: [1], exp: 3.14 }, { args: [2], exp: 12.57 }, { args: [5], exp: 78.54 }]
            }
        ]
    },
    {
        name: "Condicionais", tag: "N2", exercises: [
            {
                title: "Par ou ímpar", conceptIds: ["remainder","comparisons"], desc: "Retorne true se o número for par e false se for ímpar.", sig: "function ehPar(n) { ... }", starter: "function ehPar(n) {\n  // use o resto da divisão\n\n}", fn: "ehPar", difficulty: "facil", xp: 120, skill: "condicionais e operador de resto",
                hints: ["O operador % mostra o resto da divisão.", "Um número é par quando o resto da divisão por 2 é 0.", "return n % 2 === 0;"],
                tests: [{ args: [4], exp: true }, { args: [7], exp: false }, { args: [0], exp: true }]
            },
            {
                title: "Positivo, negativo ou zero", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'positivo', 'negativo' ou 'zero' de acordo com o valor recebido.", sig: "function classificarNumero(n) { ... }", starter: "function classificarNumero(n) {\n  // pense nos três caminhos possíveis\n\n}", fn: "classificarNumero", difficulty: "facil", xp: 120, skill: "if e else para escolher caminhos",
                hints: ["Primeiro verifique se n é maior que zero.", "Depois trate o caso menor que zero.", "if (n > 0) return 'positivo';\nif (n < 0) return 'negativo';\nreturn 'zero';"],
                tests: [{ args: [8], exp: "positivo" }, { args: [-2], exp: "negativo" }, { args: [0], exp: "zero" }]
            },
            {
                title: "Maior número", conceptIds: ["conditionals","comparisons"], desc: "Retorne o maior entre a e b.", sig: "function maior(a, b) { ... }", starter: "function maior(a, b) {\n\n}", fn: "maior", difficulty: "facil", xp: 120, skill: "comparações com if e else",
                hints: ["Compare a com b usando >.", "Se a não for maior, b é o resultado.", "return a > b ? a : b;"],
                tests: [{ args: [10, 4], exp: 10 }, { args: [3, 9], exp: 9 }, { args: [5, 5], exp: 5 }]
            },
            {
                title: "Pode dirigir?", conceptIds: ["comparisons"], desc: "Retorne true quando a idade for 18 ou mais.", sig: "function podeDirigir(idade) { ... }", starter: "function podeDirigir(idade) {\n\n}", fn: "podeDirigir", difficulty: "medio", xp: 180, skill: "comparação com maior ou igual",
                hints: ["A condição precisa aceitar exatamente 18.", "Use >= para representar 'maior ou igual'.", "return idade >= 18;"],
                tests: [{ args: [18], exp: true }, { args: [17], exp: false }, { args: [25], exp: true }]
            },
            {
                title: "Aprovado ou reprovado", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'aprovado' para nota maior ou igual a 7; caso contrário, 'reprovado'.", sig: "function resultado(nota) { ... }", starter: "function resultado(nota) {\n\n}", fn: "resultado", difficulty: "medio", xp: 180, skill: "if e else com regra de negócio",
                hints: ["A nota mínima é 7.", "Use >= para incluir exatamente 7.", "return nota >= 7 ? 'aprovado' : 'reprovado';"],
                tests: [{ args: [8], exp: "aprovado" }, { args: [7], exp: "aprovado" }, { args: [6.9], exp: "reprovado" }]
            },
            {
                title: "Desconto na compra", conceptIds: ["conditionals","comparisons","multiplication"], desc: "Dê 10% de desconto quando o valor for maior ou igual a 100. Caso contrário, mantenha o valor.", sig: "function precoFinal(valor) { ... }", starter: "function precoFinal(valor) {\n  // escolha qual caminho seguir\n\n}", fn: "precoFinal", difficulty: "medio", xp: 220, skill: "condição com cálculo",
                hints: ["Primeiro descubra se o valor chegou a 100.", "10% de desconto significa pagar 90% do valor.", "return valor >= 100 ? valor * 0.9 : valor;"],
                tests: [{ args: [100], exp: 90 }, { args: [250], exp: 225 }, { args: [80], exp: 80 }]
            },
            {
                title: "Classificação de temperatura", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'frio' abaixo de 15, 'agradavel' de 15 até 29 e 'quente' a partir de 30.", sig: "function classificarTemperatura(t) { ... }", starter: "function classificarTemperatura(t) {\n  // existem três caminhos\n\n}", fn: "classificarTemperatura", difficulty: "dificil", xp: 300, skill: "múltiplas condições com else if",
                hints: ["Comece verificando o limite de 15.", "Depois trate a faixa até 29.", "if (t < 15) return 'frio';\nif (t < 30) return 'agradavel';\nreturn 'quente';"],
                tests: [{ args: [10], exp: "frio" }, { args: [15], exp: "agradavel" }, { args: [30], exp: "quente" }]
            },
            {
                title: "Senha válida", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne true somente se a senha tiver pelo menos 8 caracteres e for diferente de '12345678'.", sig: "function senhaValida(senha) { ... }", starter: "function senhaValida(senha) {\n\n}", fn: "senhaValida", difficulty: "dificil", xp: 320, skill: "combinar condições com &&",
                hints: ["Você precisa que as duas condições sejam verdadeiras.", "Use && para representar 'e'.", "return senha.length >= 8 && senha !== '12345678';"],
                tests: [{ args: ["codempi2026"], exp: true }, { args: ["12345678"], exp: false }, { args: ["abc"], exp: false }]
            },
            {
                title: "Frete grátis", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne 'gratis' se a compra for 200 ou mais ou se o cliente for assinante. Caso contrário, retorne 'pago'.", sig: "function tipoFrete(valor, assinante) { ... }", starter: "function tipoFrete(valor, assinante) {\n\n}", fn: "tipoFrete", difficulty: "dificil", xp: 350, skill: "combinar condições com ||",
                hints: ["Basta uma das condições ser verdadeira.", "Use || para representar 'ou'.", "return valor >= 200 || assinante ? 'gratis' : 'pago';"],
                tests: [{ args: [250, false], exp: "gratis" }, { args: [100, true], exp: "gratis" }, { args: [100, false], exp: "pago" }]
            },
            {
                title: "BOSS · Classificador de acesso", conceptIds: ["conditionals","comparisons","booleanLogic"], desc: "Classifique o acesso: 'bloqueado' se a conta estiver inativa; 'admin' se estiver ativa e for admin; 'usuario' nos demais casos.", sig: "function classificarAcesso(ativo, admin) { ... }", starter: "function classificarAcesso(ativo, admin) {\n  // pense na ordem das condições\n\n}", fn: "classificarAcesso", difficulty: "boss", xp: 550, skill: "ordenar múltiplas condições",
                hints: ["O estado inativo deve ser tratado primeiro.", "Depois de garantir que está ativo, verifique se é admin.", "if (!ativo) return 'bloqueado';\nif (admin) return 'admin';\nreturn 'usuario';"],
                tests: [{ args: [false, true], exp: "bloqueado" }, { args: [true, true], exp: "admin" }, { args: [true, false], exp: "usuario" }]
            }
        ]
    },
    {
        name: "Loops", tag: "N3", exercises: [
            {
                title: "Soma até N", conceptIds: ["loops","accumulators"], desc: "Retorne a soma de todos os números inteiros de 1 até n.", sig: "function somaAte(n) { ... }", starter: "function somaAte(n) {\n  let total = 0;\n\n  // some 1, 2, 3... até n\n}", fn: "somaAte", difficulty: "facil", xp: 120, skill: "usar um laço para acumular valores",
                hints: ["Comece com total = 0.", "Repita os valores de 1 até n e adicione cada um ao total.", "for (let i = 1; i <= n; i++) total += i;\nreturn total;"],
                tests: [{ args: [1], exp: 1 }, { args: [5], exp: 15 }, { args: [10], exp: 55 }]
            },
            {
                title: "Contando pares", conceptIds: ["loops","counters","conditionals","remainder"], desc: "Conte quantos números pares existem de 1 até n.", sig: "function contarPares(n) { ... }", starter: "function contarPares(n) {\n  let quantidade = 0;\n\n  // conte os números pares\n}", fn: "contarPares", difficulty: "facil", xp: 120, skill: "usar contador, laço e resto da divisão",
                hints: ["Use uma variável para guardar a quantidade encontrada.", "Um número é par quando o resto da divisão por 2 é 0.", "for (let i = 1; i <= n; i++) {\n  if (i % 2 === 0) quantidade++;\n}\nreturn quantidade;"],
                tests: [{ args: [1], exp: 0 }, { args: [6], exp: 3 }, { args: [10], exp: 5 }]
            },
            {
                title: "Soma dos múltiplos de 3", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma dos números entre 1 e n que são múltiplos de 3.", sig: "function somaMultiplosDe3(n) { ... }", starter: "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  // encontre os múltiplos de 3\n}", fn: "somaMultiplosDe3", difficulty: "medio", xp: 180, skill: "combinar laço, condição e acumulador",
                hints: ["Percorra de 1 até n.", "Um múltiplo de 3 deixa resto 0 quando dividido por 3.", "for (let i = 1; i <= n; i++) {\n  if (i % 3 === 0) total += i;\n}\nreturn total;"],
                tests: [{ args: [3], exp: 3 }, { args: [10], exp: 18 }, { args: [15], exp: 45 }]
            },
            {
                title: "Soma dos ímpares", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma de todos os números ímpares de 1 até n.", sig: "function somaImpares(n) { ... }", starter: "function somaImpares(n) {\n  let total = 0;\n\n  // some apenas os ímpares\n}", fn: "somaImpares", difficulty: "medio", xp: 180, skill: "filtrar valores dentro de um laço",
                hints: ["Você pode identificar ímpares olhando o resto da divisão por 2.", "Para um número ímpar, i % 2 não é 0.", "for (let i = 1; i <= n; i++) {\n  if (i % 2 !== 0) total += i;\n}\nreturn total;"],
                tests: [{ args: [5], exp: 9 }, { args: [10], exp: 25 }, { args: [1], exp: 1 }]
            },
            {
                title: "Fatorial", conceptIds: ["loops","accumulators"], desc: "Retorne o fatorial de n. Considere que 0! = 1.", sig: "function fatorial(n) { ... }", starter: "function fatorial(n) {\n  let resultado = 1;\n\n  // multiplique pelos números de 1 até n\n}", fn: "fatorial", difficulty: "medio", xp: 220, skill: "usar acumulador para multiplicação",
                hints: ["O resultado precisa começar em 1.", "Multiplique resultado pelo contador a cada volta.", "for (let i = 1; i <= n; i++) resultado *= i;\nreturn resultado;"],
                tests: [{ args: [0], exp: 1 }, { args: [4], exp: 24 }, { args: [6], exp: 720 }]
            },
            {
                title: "Soma de uma lista", conceptIds: ["loops","accumulators","iteration"], desc: "A lista já vem pronta. Percorra seus valores e retorne a soma de todos eles.", sig: "function somarLista(valores) { ... }", starter: "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista usando um índice\n}", fn: "somarLista", difficulty: "medio", xp: 220, skill: "percorrer uma lista com um laço",
                hints: ["A lista possui um tamanho em valores.length.", "Use um índice que começa em 0 e vai até antes de valores.length.", "for (let i = 0; i < valores.length; i++) total += valores[i];\nreturn total;"],
                tests: [{ args: [[2, 3, 5]], exp: 10 }, { args: [[10, -2, 4]], exp: 12 }, { args: [[7]], exp: 7 }]
            },
            {
                title: "Média da lista", conceptIds: ["loops","accumulators","iteration","division"], desc: "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.", sig: "function mediaLista(valores) { ... }", starter: "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}", fn: "mediaLista", difficulty: "dificil", xp: 280, skill: "combinar percurso, acumulador e divisão",
                hints: ["Primeiro acumule a soma dos valores.", "A quantidade de valores está em valores.length.", "return total / valores.length;"],
                tests: [{ args: [[2, 4, 6]], exp: 4 }, { args: [[10, 20]], exp: 15 }, { args: [[5]], exp: 5 }]
            },
            {
                title: "Maior valor da lista", conceptIds: ["loops","iteration","comparisons"], desc: "Percorra a lista e retorne o maior valor encontrado.", sig: "function maiorValor(valores) { ... }", starter: "function maiorValor(valores) {\n  let maior = valores[0];\n\n  // compare os próximos valores com maior\n}", fn: "maiorValor", difficulty: "dificil", xp: 300, skill: "percorrer valores e manter o maior encontrado",
                hints: ["Comece considerando o primeiro valor como o maior atual.", "Compare cada valor com maior.", "for (let i = 1; i < valores.length; i++) {\n  if (valores[i] > maior) maior = valores[i];\n}\nreturn maior;"],
                tests: [{ args: [[3, 8, 2]], exp: 8 }, { args: [[-5, -2, -9]], exp: -2 }, { args: [[10, 10, 4]], exp: 10 }]
            },
            {
                title: "Acima do limite", conceptIds: ["loops","counters","iteration","comparisons"], desc: "Conte quantos valores da lista são maiores que o limite informado.", sig: "function contarAcima(valores, limite) { ... }", starter: "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  // conte os valores maiores que limite\n}", fn: "contarAcima", difficulty: "dificil", xp: 350, skill: "combinar contador, comparação e percurso",
                hints: ["Comece o contador em zero.", "Percorra a lista e compare cada valor com limite.", "if (valores[i] > limite) quantidade++;\nreturn quantidade;"],
                tests: [{ args: [[2, 5, 8, 1], 4], exp: 2 }, { args: [[10, 10, 3], 10], exp: 0 }, { args: [[-1, 0, 4], -2], exp: 3 }]
            },
            {
                title: "BOSS · Maior salto", conceptIds: ["loops","iteration","comparisons","accumulators"], desc: "Uma lista representa valores registrados em sequência. Retorne a maior diferença absoluta entre dois valores consecutivos. Com uma lista de um único item, retorne 0.", sig: "function maiorSalto(valores) { ... }", starter: "function maiorSalto(valores) {\n  let maior = 0;\n\n  // compare cada valor com o anterior\n}", fn: "maiorSalto", difficulty: "boss", xp: 550, skill: "combinar percurso, comparação e atualização de um melhor resultado",
                hints: ["Comece o maior salto em 0.", "A partir do segundo valor, compare valores[i] com valores[i - 1].", "const salto = Math.abs(valores[i] - valores[i - 1]);\nif (salto > maior) maior = salto;\nreturn maior;"],
                tests: [{ args: [[10]], exp: 0 }, { args: [[10, 4, 12, 7]], exp: 8 }, { args: [[-5, -1, -9]], exp: 8 }]
            }
        ]
    },
    { name: "Strings", tag: "N4", exercises: null, count: 10, topics: "tamanho, maiúsculas, minúsculas, inverter, primeira letra, última letra, contar letras, substituir, palíndromo, comparação" },
    { name: "Arrays", tag: "N5", exercises: null, count: 10, topics: "soma, média, maior, menor, busca, filtro, pares, positivos, remover duplicados, inverter" },
    { name: "Funções e Lógica", tag: "N6", exercises: null, count: 10, topics: "calculadora, conversão, fatorial, Fibonacci, validações, contador, desconto, juros, IMC, múltiplas funções" },
    { name: "Objetos", tag: "N7", exercises: null, count: 10, topics: "acessar, alterar, adicionar, remover, validar, calcular dados, lista de jogadores, produtos, usuários, inventário" },
    { name: "Lógica Avançada", tag: "N8", exercises: null, count: 10, topics: "segundo maior, frequência, agrupamento, números repetidos, interseção, diferença, soma alvo, sequência, estatísticas, desafios combinados" },
    { name: "Algoritmos", tag: "N9", exercises: null, count: 10, topics: "busca linear, busca binária, ordenação manual, maior sequência, contagem, frequência, mínimo/máximo, comparação, algoritmo combinado, otimização" },
    { name: "Boss Final", tag: "N10", exercises: null, count: 5, topics: "inventário, ranking, sistema bancário, sistema de cadastro, mini jogo" }
];
