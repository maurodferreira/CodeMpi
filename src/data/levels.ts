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
                hints: ["Pense no que a função precisa devolver.","Use return para devolver a soma de a com b.","function somar(a, b) {\n  return a + b;\n}"],
                tests: [{ args: [2, 3], exp: 5 }, { args: [-1, 1], exp: 0 }, { args: [10, 15], exp: 25 }]
            },
            {
                title: "Subtração de dois números", conceptIds: ["return","subtraction"], desc: "Retorne o resultado de a menos b.", sig: "function subtrair(a, b) { ... }", starter: "function subtrair(a, b) {\n\n}", fn: "subtrair", difficulty: "facil", xp: 100, skill: "usar o operador - para subtrair o segundo parâmetro do primeiro",
                hints: ["Pense no resultado que a função precisa devolver.","Use return e subtraia b de a.","function subtrair(a, b) {\n  return a - b;\n}"],
                tests: [{ args: [10, 4], exp: 6 }, { args: [5, 5], exp: 0 }, { args: [3, 10], exp: -7 }]
            },
            {
                title: "Dobro de um número", conceptIds: ["return","multiplication"], desc: "Retorne o dobro (n × 2) do número recebido.", sig: "function dobro(n) { ... }", starter: "function dobro(n) {\n\n}", fn: "dobro", difficulty: "facil", xp: 100, skill: "usar o operador * para multiplicar o valor por 2",
                hints: ["Pense em como transformar n no dobro.","Multiplique n por 2 e devolva o resultado com return.","function dobro(n) {\n  return n * 2;\n}"],
                tests: [{ args: [4], exp: 8 }, { args: [0], exp: 0 }, { args: [-3], exp: -6 }]
            },
            {
                title: "Multiplicação de dois números", conceptIds: ["return","multiplication"], desc: "Retorne o produto de a e b.", sig: "function multiplicar(a, b) { ... }", starter: "function multiplicar(a, b) {\n\n}", fn: "multiplicar", difficulty: "medio", xp: 200, skill: "usar o operador * entre dois valores",
                hints: ["Pense em qual operação transforma os dois parâmetros em um produto.","Use o operador * entre a e b e devolva o resultado com return.","function multiplicar(a, b) {\n  return a * b;\n}"],
                tests: [{ args: [3, 4], exp: 12 }, { args: [0, 9], exp: 0 }, { args: [-2, 5], exp: -10 }]
            },
            {
                title: "Divisão de dois números", conceptIds: ["return","division"], desc: "Retorne o resultado de a dividido por b. O resultado pode ser decimal.", sig: "function dividir(a, b) { ... }", starter: "function dividir(a, b) {\n\n}", fn: "dividir", difficulty: "medio", xp: 200, skill: "usar o operador / para dividir dois valores",
                hints: ["Pense em qual operação transforma os dois parâmetros em um quociente.","Use / entre a e b e devolva o resultado com return.","function dividir(a, b) {\n  return a / b;\n}"],
                tests: [{ args: [10, 2], exp: 5 }, { args: [7, 2], exp: 3.5 }, { args: [9, 3], exp: 3 }]
            },
            {
                title: "Triplo de um número", conceptIds: ["return","multiplication"], desc: "Retorne o triplo (n × 3) do número recebido.", sig: "function triplo(n) { ... }", starter: "function triplo(n) {\n\n}", fn: "triplo", difficulty: "medio", xp: 200, skill: "usar o operador * para multiplicar o valor por 3",
                hints: ["Pense em como transformar n no triplo.","Multiplique n por 3 e devolva o resultado com return.","function triplo(n) {\n  return n * 3;\n}"],
                tests: [{ args: [2], exp: 6 }, { args: [0], exp: 0 }, { args: [-4], exp: -12 }]
            },
            {
                title: "Média de três números", conceptIds: ["return","addition","division","expressions"], desc: "Receba três números e retorne a média aritmética entre eles.", sig: "function media3(a, b, c) { ... }", starter: "function media3(a, b, c) {\n  // some os três e divida por 3\n\n}", fn: "media3", difficulty: "dificil", xp: 350, skill: "combinar soma e divisão para calcular uma média",
                hints: ["Pense nas duas etapas necessárias para calcular uma média.","Some a, b e c e depois divida a soma por 3.","function media3(a, b, c) {\n  return (a + b + c) / 3;\n}"],
                tests: [{ args: [3, 6, 9], exp: 6 }, { args: [10, 10, 10], exp: 10 }, { args: [1, 2, 3], exp: 2 }]
            },
            {
                title: "Resto da divisão", conceptIds: ["return","remainder"], desc: "Retorne o resto da divisão de a por b.", sig: "function resto(a, b) { ... }", starter: "function resto(a, b) {\n\n}", fn: "resto", difficulty: "dificil", xp: 350, skill: "usar o operador % para obter o resto da divisão",
                hints: ["Pense no que sobra depois de uma divisão.","Use o operador % para obter o resto de a por b.","function resto(a, b) {\n  return a % b;\n}"],
                tests: [{ args: [10, 3], exp: 1 }, { args: [20, 5], exp: 0 }, { args: [7, 2], exp: 1 }]
            },
            {
                title: "Celsius para Fahrenheit", conceptIds: ["return","multiplication","division","addition","expressions"], desc: "Receba uma temperatura em Celsius e retorne o equivalente em Fahrenheit.", sig: "function celsiusParaFahrenheit(c) { ... }", starter: "function celsiusParaFahrenheit(c) {\n  // Fahrenheit = Celsius * 9/5 + 32\n\n}", fn: "celsiusParaFahrenheit", difficulty: "dificil", xp: 350, skill: "aplicar a fórmula Celsius × 9 / 5 + 32 na ordem correta",
                hints: ["Pense na fórmula que transforma Celsius em Fahrenheit.","Aplique c × 9, divida por 5 e some 32.","function celsiusParaFahrenheit(c) {\n  return c * 9 / 5 + 32;\n}"],
                tests: [{ args: [0], exp: 32 }, { args: [100], exp: 212 }, { args: [20], exp: 68 }]
            },
            {
                title: "Área do círculo", conceptIds: ["return","multiplication","expressions"], desc: "Receba o raio de um círculo e retorne sua área, arredondada para 2 casas decimais. Use Math.PI.", sig: "function areaCirculo(r) { ... }", starter: "function areaCirculo(r) {\n  // área = π × r × r — arredonde para 2 casas decimais\n\n}", fn: "areaCirculo", difficulty: "boss", xp: 500, skill: "calcular a área com Math.PI e arredondar para duas casas decimais",
                hints: ["Pense na fórmula matemática da área do círculo.","Use Math.PI, multiplique o raio por ele mesmo e arredonde para 2 casas.","function areaCirculo(r) {\n  return Math.round(Math.PI * r * r * 100) / 100;\n}"],
                tests: [{ args: [1], exp: 3.14 }, { args: [2], exp: 12.57 }, { args: [5], exp: 78.54 }]
            }
        ]
    },
    {
        name: "Condicionais", tag: "N2", exercises: [
            {
                title: "Par ou ímpar", conceptIds: ["remainder","comparisons"], desc: "Retorne true se o número for par e false se for ímpar.", sig: "function ehPar(n) { ... }", starter: "function ehPar(n) {\n  // use o resto da divisão\n\n}", fn: "ehPar", difficulty: "facil", xp: 120, skill: "condicionais e operador de resto",
                hints: ["Pense em como descobrir se um número é divisível por 2.","Use % para verificar se o resto da divisão por 2 é zero.","function ehPar(n) {\n  return n % 2 === 0;\n}"],
                tests: [{ args: [4], exp: true }, { args: [7], exp: false }, { args: [0], exp: true }]
            },
            {
                title: "Positivo, negativo ou zero", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'positivo', 'negativo' ou 'zero' de acordo com o valor recebido.", sig: "function classificarNumero(n) { ... }", starter: "function classificarNumero(n) {\n  // pense nos três caminhos possíveis\n\n}", fn: "classificarNumero", difficulty: "facil", xp: 120, skill: "if e else para escolher caminhos",
                hints: ["Pense nos três caminhos possíveis para o valor recebido.","Verifique primeiro se n é maior que zero, depois se é menor que zero.","function classificarNumero(n) {\n  if (n > 0) return 'positivo';\n  if (n < 0) return 'negativo';\n  return 'zero';\n}"],
                tests: [{ args: [8], exp: "positivo" }, { args: [-2], exp: "negativo" }, { args: [0], exp: "zero" }]
            },
            {
                title: "Maior número", conceptIds: ["conditionals","comparisons"], desc: "Retorne o maior entre a e b.", sig: "function maior(a, b) { ... }", starter: "function maior(a, b) {\n\n}", fn: "maior", difficulty: "facil", xp: 120, skill: "comparações com if e else",
                hints: ["Pense em como comparar dois números.","Compare a com b; se a não for maior, b é o resultado.","function maior(a, b) {\n  return a > b ? a : b;\n}"],
                tests: [{ args: [10, 4], exp: 10 }, { args: [3, 9], exp: 9 }, { args: [5, 5], exp: 5 }]
            },
            {
                title: "Pode dirigir?", conceptIds: ["comparisons"], desc: "Retorne true quando a idade for 18 ou mais.", sig: "function podeDirigir(idade) { ... }", starter: "function podeDirigir(idade) {\n\n}", fn: "podeDirigir", difficulty: "medio", xp: 180, skill: "comparação com maior ou igual",
                hints: ["Pense no limite mínimo de idade pedido pela missão.","A condição precisa aceitar 18, então use uma comparação de maior ou igual.","function podeDirigir(idade) {\n  return idade >= 18;\n}"],
                tests: [{ args: [18], exp: true }, { args: [17], exp: false }, { args: [25], exp: true }]
            },
            {
                title: "Aprovado ou reprovado", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'aprovado' para nota maior ou igual a 7; caso contrário, 'reprovado'.", sig: "function resultado(nota) { ... }", starter: "function resultado(nota) {\n\n}", fn: "resultado", difficulty: "medio", xp: 180, skill: "if e else com regra de negócio",
                hints: ["Pense na nota mínima necessária para cada resultado.","Compare a nota com 7 usando >= e escolha entre os dois resultados.","function resultado(nota) {\n  return nota >= 7 ? 'aprovado' : 'reprovado';\n}"],
                tests: [{ args: [8], exp: "aprovado" }, { args: [7], exp: "aprovado" }, { args: [6.9], exp: "reprovado" }]
            },
            {
                title: "Desconto na compra", conceptIds: ["conditionals","comparisons","multiplication"], desc: "Dê 10% de desconto quando o valor for maior ou igual a 100. Caso contrário, mantenha o valor.", sig: "function precoFinal(valor) { ... }", starter: "function precoFinal(valor) {\n  // escolha qual caminho seguir\n\n}", fn: "precoFinal", difficulty: "medio", xp: 220, skill: "condição com cálculo",
                hints: ["Pense primeiro em quando o desconto deve acontecer.","Se o valor for pelo menos 100, o cliente paga 90% do preço.","function precoFinal(valor) {\n  return valor >= 100 ? valor * 0.9 : valor;\n}"],
                tests: [{ args: [100], exp: 90 }, { args: [250], exp: 225 }, { args: [80], exp: 80 }]
            },
            {
                title: "Classificação de temperatura", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'frio' abaixo de 15, 'agradavel' de 15 até 29 e 'quente' a partir de 30.", sig: "function classificarTemperatura(t) { ... }", starter: "function classificarTemperatura(t) {\n  // existem três caminhos\n\n}", fn: "classificarTemperatura", difficulty: "dificil", xp: 300, skill: "múltiplas condições com else if",
                hints: ["Pense nas três faixas de temperatura da missão.","Verifique primeiro abaixo de 15, depois abaixo de 30; o restante é quente.","function classificarTemperatura(t) {\n  if (t < 15) return 'frio';\n  if (t < 30) return 'agradavel';\n  return 'quente';\n}"],
                tests: [{ args: [10], exp: "frio" }, { args: [15], exp: "agradavel" }, { args: [30], exp: "quente" }]
            },
            {
                title: "Senha válida", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne true somente se a senha tiver pelo menos 8 caracteres e for diferente de '12345678'.", sig: "function senhaValida(senha) { ... }", starter: "function senhaValida(senha) {\n\n}", fn: "senhaValida", difficulty: "dificil", xp: 320, skill: "combinar condições com &&",
                hints: ["Pense nas duas regras que precisam ser verdadeiras ao mesmo tempo.","Use && para exigir tamanho mínimo de 8 e uma senha diferente de 12345678.","function senhaValida(senha) {\n  return senha.length >= 8 && senha !== '12345678';\n}"],
                tests: [{ args: ["codempi2026"], exp: true }, { args: ["12345678"], exp: false }, { args: ["abc"], exp: false }]
            },
            {
                title: "Frete grátis", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne 'gratis' se a compra for 200 ou mais ou se o cliente for assinante. Caso contrário, retorne 'pago'.", sig: "function tipoFrete(valor, assinante) { ... }", starter: "function tipoFrete(valor, assinante) {\n\n}", fn: "tipoFrete", difficulty: "dificil", xp: 350, skill: "combinar condições com ||",
                hints: ["Pense nas duas situações que liberam o frete grátis.","Use || porque basta a compra atingir 200 ou o cliente ser assinante.","function tipoFrete(valor, assinante) {\n  return valor >= 200 || assinante ? 'gratis' : 'pago';\n}"],
                tests: [{ args: [250, false], exp: "gratis" }, { args: [100, true], exp: "gratis" }, { args: [100, false], exp: "pago" }]
            },
            {
                title: "BOSS · Classificador de acesso", conceptIds: ["conditionals","comparisons","booleanLogic"], desc: "Classifique o acesso: 'bloqueado' se a conta estiver inativa; 'admin' se estiver ativa e for admin; 'usuario' nos demais casos.", sig: "function classificarAcesso(ativo, admin) { ... }", starter: "function classificarAcesso(ativo, admin) {\n  // pense na ordem das condições\n\n}", fn: "classificarAcesso", difficulty: "boss", xp: 550, skill: "ordenar múltiplas condições",
                hints: ["Pense na ordem das regras: conta inativa, admin ativo e usuário ativo.","Trate o caso inativo primeiro; depois verifique admin e, por fim, o usuário comum.","function classificarAcesso(ativo, admin) {\n  if (!ativo) return 'bloqueado';\n  if (admin) return 'admin';\n  return 'usuario';\n}"],
                tests: [{ args: [false, true], exp: "bloqueado" }, { args: [true, true], exp: "admin" }, { args: [true, false], exp: "usuario" }]
            }
        ]
    },
    {
        name: "Loops", tag: "N3", exercises: [
            {
                title: "Soma até N", conceptIds: ["loops","accumulators"], desc: "Retorne a soma de todos os números inteiros de 1 até n.", sig: "function somaAte(n) { ... }", starter: "function somaAte(n) {\n  let total = 0;\n\n  // some 1, 2, 3... até n\n}", fn: "somaAte", difficulty: "facil", xp: 120, skill: "usar um laço para acumular valores",
                hints: ["Pense em como repetir uma operação para todos os números até n.","Use um acumulador começando em 0 e um for de 1 até n.","function somaAte(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [1], exp: 1 }, { args: [5], exp: 15 }, { args: [10], exp: 55 }]
            },
            {
                title: "Contando pares", conceptIds: ["loops","counters","conditionals","remainder"], desc: "Conte quantos números pares existem de 1 até n.", sig: "function contarPares(n) { ... }", starter: "function contarPares(n) {\n  let quantidade = 0;\n\n  // conte os números pares\n}", fn: "contarPares", difficulty: "facil", xp: 120, skill: "usar contador, laço e resto da divisão",
                hints: ["Pense em uma variável que conte quantos pares foram encontrados.","Percorra de 1 até n e aumente o contador quando i % 2 === 0.","function contarPares(n) {\n  let quantidade = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: [1], exp: 0 }, { args: [6], exp: 3 }, { args: [10], exp: 5 }]
            },
            {
                title: "Soma dos múltiplos de 3", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma dos números entre 1 e n que são múltiplos de 3.", sig: "function somaMultiplosDe3(n) { ... }", starter: "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  // encontre os múltiplos de 3\n}", fn: "somaMultiplosDe3", difficulty: "medio", xp: 180, skill: "combinar laço, condição e acumulador",
                hints: ["Pense em como identificar números divisíveis por 3 durante uma repetição.","Percorra de 1 até n e some apenas os valores cujo resto por 3 seja 0.","function somaMultiplosDe3(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0) total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [3], exp: 3 }, { args: [10], exp: 18 }, { args: [15], exp: 45 }]
            },
            {
                title: "Soma dos ímpares", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma de todos os números ímpares de 1 até n.", sig: "function somaImpares(n) { ... }", starter: "function somaImpares(n) {\n  let total = 0;\n\n  // some apenas os ímpares\n}", fn: "somaImpares", difficulty: "medio", xp: 180, skill: "filtrar valores dentro de um laço",
                hints: ["Pense em como identificar um número que não é divisível por 2.","Percorra de 1 até n e some os valores cujo resto por 2 seja diferente de 0.","function somaImpares(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 !== 0) total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [5], exp: 9 }, { args: [10], exp: 25 }, { args: [1], exp: 1 }]
            },
            {
                title: "Fatorial", conceptIds: ["loops","accumulators"], desc: "Retorne o fatorial de n. Considere que 0! = 1.", sig: "function fatorial(n) { ... }", starter: "function fatorial(n) {\n  let resultado = 1;\n\n  // multiplique pelos números de 1 até n\n}", fn: "fatorial", difficulty: "medio", xp: 220, skill: "usar acumulador para multiplicação",
                hints: ["Pense em uma multiplicação que vai crescendo a cada volta.","Comece o resultado em 1 e multiplique pelo contador de 1 até n.","function fatorial(n) {\n  let resultado = 1;\n\n  for (let i = 1; i <= n; i++) {\n    resultado *= i;\n  }\n\n  return resultado;\n}"],
                tests: [{ args: [0], exp: 1 }, { args: [4], exp: 24 }, { args: [6], exp: 720 }]
            },
            {
                title: "Soma de uma lista", conceptIds: ["loops","accumulators","iteration"], desc: "A lista já vem pronta. Percorra seus valores e retorne a soma de todos eles.", sig: "function somarLista(valores) { ... }", starter: "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista usando um índice\n}", fn: "somarLista", difficulty: "medio", xp: 220, skill: "percorrer uma lista com um laço",
                hints: ["Pense em como visitar cada posição da lista e acumular os valores.","Use um índice de 0 até antes de valores.length e some valores[i].","function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}"],
                tests: [{ args: [[2, 3, 5]], exp: 10 }, { args: [[10, -2, 4]], exp: 12 }, { args: [[7]], exp: 7 }]
            },
            {
                title: "Média da lista", conceptIds: ["loops","accumulators","iteration","division"], desc: "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.", sig: "function mediaLista(valores) { ... }", starter: "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}", fn: "mediaLista", difficulty: "dificil", xp: 280, skill: "combinar percurso, acumulador e divisão",
                hints: ["Pense em como calcular uma média usando uma soma e uma quantidade.","Some todos os valores e depois divida pelo tamanho da lista.","function mediaLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total / valores.length;\n}"],
                tests: [{ args: [[2, 4, 6]], exp: 4 }, { args: [[10, 20]], exp: 15 }, { args: [[5]], exp: 5 }]
            },
            {
                title: "Maior valor da lista", conceptIds: ["loops","iteration","comparisons"], desc: "Percorra a lista e retorne o maior valor encontrado.", sig: "function maiorValor(valores) { ... }", starter: "function maiorValor(valores) {\n  let maior = valores[0];\n\n  // compare os próximos valores com maior\n}", fn: "maiorValor", difficulty: "dificil", xp: 300, skill: "percorrer valores e manter o maior encontrado",
                hints: ["Pense em guardar o maior valor encontrado até cada momento.","Comece com valores[0] e substitua maior sempre que encontrar um valor maior.","function maiorValor(valores) {\n  let maior = valores[0];\n\n  for (let i = 1; i < valores.length; i++) {\n    if (valores[i] > maior) maior = valores[i];\n  }\n\n  return maior;\n}"],
                tests: [{ args: [[3, 8, 2]], exp: 8 }, { args: [[-5, -2, -9]], exp: -2 }, { args: [[10, 10, 4]], exp: 10 }]
            },
            {
                title: "Acima do limite", conceptIds: ["loops","counters","iteration","comparisons"], desc: "Conte quantos valores da lista são maiores que o limite informado.", sig: "function contarAcima(valores, limite) { ... }", starter: "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  // conte os valores maiores que limite\n}", fn: "contarAcima", difficulty: "dificil", xp: 350, skill: "combinar contador, comparação e percurso",
                hints: ["Pense em contar apenas os valores que passam do limite.","Percorra a lista, compare cada valor com limite e aumente quantidade quando for maior.","function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] > limite) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: [[2, 5, 8, 1], 4], exp: 2 }, { args: [[10, 10, 3], 10], exp: 0 }, { args: [[-1, 0, 4], -2], exp: 3 }]
            },
            {
                title: "BOSS · Maior salto", conceptIds: ["loops","iteration","comparisons","accumulators"], desc: "Uma lista representa valores registrados em sequência. Retorne a maior diferença absoluta entre dois valores consecutivos. Com uma lista de um único item, retorne 0.", sig: "function maiorSalto(valores) { ... }", starter: "function maiorSalto(valores) {\n  let maior = 0;\n\n  // compare cada valor com o anterior\n}", fn: "maiorSalto", difficulty: "boss", xp: 550, skill: "combinar percurso, comparação e atualização de um melhor resultado",
                hints: ["Pense em comparar cada valor com o valor que veio imediatamente antes.","Calcule a diferença absoluta entre vizinhos e guarde apenas o maior salto encontrado.","function maiorSalto(valores) {\n  let maior = 0;\n\n  for (let i = 1; i < valores.length; i++) {\n    const salto = Math.abs(valores[i] - valores[i - 1]);\n    if (salto > maior) maior = salto;\n  }\n\n  return maior;\n}"],
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
