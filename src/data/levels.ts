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
                hints: ["Pense no que a função precisa devolver.", "Use return para devolver a soma de a com b.", "Agora transforme os dois valores em um único resultado usando o operador + dentro da função.", "function somar(a, b) {\n  return a + b;\n}"],
                tests: [{ args: [2, 3], exp: 5 }, { args: [-1, 1], exp: 0 }, { args: [10, 15], exp: 25 }]
            },
            {
                title: "Subtração de dois números", conceptIds: ["return","subtraction"], desc: "Retorne o resultado de a menos b.", sig: "function subtrair(a, b) { ... }", starter: "function subtrair(a, b) {\n\n}", fn: "subtrair", difficulty: "facil", xp: 100, skill: "usar o operador - para subtrair o segundo parâmetro do primeiro",
                hints: ["Pense no resultado que a função precisa devolver.", "Use return e subtraia b de a.", "A operação deve acontecer na ordem a - b e o resultado precisa ser devolvido.", "function subtrair(a, b) {\n  return a - b;\n}"],
                tests: [{ args: [10, 4], exp: 6 }, { args: [5, 5], exp: 0 }, { args: [3, 10], exp: -7 }]
            },
            {
                title: "Dobro de um número", conceptIds: ["return","multiplication"], desc: "Retorne o dobro (n × 2) do número recebido.", sig: "function dobro(n) { ... }", starter: "function dobro(n) {\n\n}", fn: "dobro", difficulty: "facil", xp: 100, skill: "usar o operador * para multiplicar o valor por 2",
                hints: ["Pense em como transformar n no dobro.", "Multiplique n por 2 e devolva o resultado com return.", "O dobro é o número multiplicado por 2. Faça essa operação dentro da função e devolva o resultado.", "function dobro(n) {\n  return n * 2;\n}"],
                tests: [{ args: [4], exp: 8 }, { args: [0], exp: 0 }, { args: [-3], exp: -6 }]
            },
            {
                title: "Multiplicação de dois números", conceptIds: ["return","multiplication"], desc: "Retorne o produto de a e b.", sig: "function multiplicar(a, b) { ... }", starter: "function multiplicar(a, b) {\n\n}", fn: "multiplicar", difficulty: "medio", xp: 200, skill: "usar o operador * entre dois valores",
                hints: ["Pense em qual operação transforma os dois parâmetros em um produto.", "Use o operador * entre a e b e devolva o resultado com return.", "Coloque a operação de multiplicação entre a e b dentro da função e devolva o produto.", "function multiplicar(a, b) {\n  return a * b;\n}"],
                tests: [{ args: [3, 4], exp: 12 }, { args: [0, 9], exp: 0 }, { args: [-2, 5], exp: -10 }]
            },
            {
                title: "Divisão de dois números", conceptIds: ["return","division"], desc: "Retorne o resultado de a dividido por b. O resultado pode ser decimal.", sig: "function dividir(a, b) { ... }", starter: "function dividir(a, b) {\n\n}", fn: "dividir", difficulty: "medio", xp: 200, skill: "usar o operador / para dividir dois valores",
                hints: ["Pense em qual operação transforma os dois parâmetros em um quociente.", "Use / entre a e b e devolva o resultado com return.", "Divida o primeiro parâmetro pelo segundo e devolva diretamente o resultado.", "function dividir(a, b) {\n  return a / b;\n}"],
                tests: [{ args: [10, 2], exp: 5 }, { args: [7, 2], exp: 3.5 }, { args: [9, 3], exp: 3 }]
            },
            {
                title: "Atualizando o total", conceptIds: ["return","variables","addition"], desc: "Comece com pontos como total, adicione o bonus ao total e retorne o novo valor.", sig: "function adicionarBonus(pontos, bonus) { ... }", starter: "function adicionarBonus(pontos, bonus) {\n  let total = pontos;\n\n  // atualize total e depois retorne o resultado\n}", fn: "adicionarBonus", difficulty: "medio", xp: 200, skill: "criar uma variável e atualizar seu valor usando uma operação",
                hints: ["Pense em uma variável que represente o valor que será atualizado.", "Crie total começando com pontos e some bonus a esse total.", "Primeiro use let total = pontos; depois atualize com total = total + bonus e retorne total.", "function adicionarBonus(pontos, bonus) {\n  let total = pontos;\n  total = total + bonus;\n\n  return total;\n}"],
                tests: [{ args: [100, 25], exp: 125 }, { args: [0, 10], exp: 10 }, { args: [50, -5], exp: 45 }]
            },
            {
                title: "Média de três números", conceptIds: ["return","addition","division","expressions"], desc: "Receba três números e retorne a média aritmética entre eles.", sig: "function media3(a, b, c) { ... }", starter: "function media3(a, b, c) {\n  // some os três e divida por 3\n\n}", fn: "media3", difficulty: "dificil", xp: 350, skill: "combinar soma e divisão para calcular uma média",
                hints: ["Pense nas duas etapas necessárias para calcular uma média.", "Some a, b e c e depois divida a soma por 3.", "Primeiro forme a soma dos três valores; depois transforme essa soma na média dividindo por 3.", "function media3(a, b, c) {\n  return (a + b + c) / 3;\n}"],
                tests: [{ args: [3, 6, 9], exp: 6 }, { args: [10, 10, 10], exp: 10 }, { args: [1, 2, 3], exp: 2 }]
            },
            {
                title: "Resto da divisão", conceptIds: ["return","remainder"], desc: "Retorne o resto da divisão de a por b.", sig: "function resto(a, b) { ... }", starter: "function resto(a, b) {\n\n}", fn: "resto", difficulty: "medio", xp: 350, skill: "usar o operador % para obter o resto da divisão",
                hints: ["Pense no que sobra depois de uma divisão.", "Use o operador % para obter o resto de a por b.", "Você não precisa calcular a divisão inteira: o operador % já devolve diretamente o que sobra.", "function resto(a, b) {\n  return a % b;\n}"],
                tests: [{ args: [10, 3], exp: 1 }, { args: [20, 5], exp: 0 }, { args: [7, 2], exp: 1 }]
            },
            {
                title: "Celsius para Fahrenheit", conceptIds: ["return","multiplication","division","addition","expressions"], desc: "Receba uma temperatura em Celsius e retorne o equivalente em Fahrenheit.", sig: "function celsiusParaFahrenheit(c) { ... }", starter: "function celsiusParaFahrenheit(c) {\n  // Fahrenheit = Celsius * 9/5 + 32\n\n}", fn: "celsiusParaFahrenheit", difficulty: "dificil", xp: 350, skill: "aplicar a fórmula Celsius × 9 / 5 + 32 na ordem correta",
                hints: ["Pense na fórmula que transforma Celsius em Fahrenheit.", "Aplique c × 9, divida por 5 e some 32.", "A expressão final combina multiplicação, divisão e soma: c × 9 / 5 + 32.", "function celsiusParaFahrenheit(c) {\n  return c * 9 / 5 + 32;\n}"],
                tests: [{ args: [0], exp: 32 }, { args: [100], exp: 212 }, { args: [20], exp: 68 }]
            },
            {
                title: "Área do círculo", conceptIds: ["return","multiplication","expressions"], desc: "Receba o raio de um círculo e retorne sua área, arredondada para 2 casas decimais. Use Math.PI.", sig: "function areaCirculo(r) { ... }", starter: "function areaCirculo(r) {\n  // área = π × r × r — arredonde para 2 casas decimais\n\n}", fn: "areaCirculo", difficulty: "boss", xp: 500, skill: "calcular a área com Math.PI e arredondar para duas casas decimais",
                hints: ["Pense na fórmula matemática da área do círculo.", "Use Math.PI, multiplique o raio por ele mesmo e arredonde para 2 casas.", "Monte a expressão π × r × r e use Math.round para manter somente duas casas decimais.", "function areaCirculo(r) {\n  return Math.round(Math.PI * r * r * 100) / 100;\n}"],
                tests: [{ args: [1], exp: 3.14 }, { args: [2], exp: 12.57 }, { args: [5], exp: 78.54 }, { args: [0], exp: 0 }]
            }
        ]
    },
    {
        name: "Condicionais", tag: "N2", exercises: [
            {
                title: "Par ou ímpar", conceptIds: ["remainder","comparisons"], desc: "Retorne true se o número for par e false se for ímpar.", sig: "function ehPar(n) { ... }", starter: "function ehPar(n) {\n  // use o resto da divisão\n\n}", fn: "ehPar", difficulty: "facil", xp: 120, skill: "condicionais e operador de resto",
                hints: ["Pense em como descobrir se um número é divisível por 2.", "Use % para verificar se o resto da divisão por 2 é zero.", "A condição que resolve a missão é verificar se o resto de n por 2 é exatamente 0.", "function ehPar(n) {\n  if (n % 2 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}"],
                tests: [{ args: [4], exp: true }, { args: [7], exp: false }, { args: [0], exp: true }]
            },
            {
                title: "Positivo, negativo ou zero", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'positivo', 'negativo' ou 'zero' de acordo com o valor recebido.", sig: "function classificarNumero(n) { ... }", starter: "function classificarNumero(n) {\n  // pense nos três caminhos possíveis\n\n}", fn: "classificarNumero", difficulty: "facil", xp: 120, skill: "if e else para escolher caminhos",
                hints: ["Pense nos três caminhos possíveis para o valor recebido.", "Verifique primeiro se n é maior que zero, depois se é menor que zero.", "Use dois testes em sequência: primeiro n > 0, depois n < 0; se nenhum for verdadeiro, sobrou o caso zero.", "function classificarNumero(n) {\n  if (n > 0) {\n    return 'positivo';\n  } else if (n < 0) {\n    return 'negativo';\n  }\n\n  return 'zero';\n}"],
                tests: [{ args: [8], exp: "positivo" }, { args: [-2], exp: "negativo" }, { args: [0], exp: "zero" }]
            },
            {
                title: "Maior número", conceptIds: ["conditionals","comparisons"], desc: "Retorne o maior entre a e b.", sig: "function maior(a, b) { ... }", starter: "function maior(a, b) {\n\n}", fn: "maior", difficulty: "facil", xp: 120, skill: "comparações com if e else",
                hints: ["Pense em como comparar dois números.", "Compare a com b; se a não for maior, b é o resultado.", "Uma forma direta é retornar a quando a > b e, caso contrário, retornar b.", "function maior(a, b) {\n  if (a > b) {\n    return a;\n  } else {\n    return b;\n  }\n}"],
                tests: [{ args: [10, 4], exp: 10 }, { args: [3, 9], exp: 9 }, { args: [5, 5], exp: 5 }]
            },
            {
                title: "Pode dirigir?", conceptIds: ["comparisons"], desc: "Retorne true quando a idade for 18 ou mais.", sig: "function podeDirigir(idade) { ... }", starter: "function podeDirigir(idade) {\n\n}", fn: "podeDirigir", difficulty: "medio", xp: 180, skill: "comparação com maior ou igual",
                hints: ["Pense no limite mínimo de idade pedido pela missão.", "A condição precisa aceitar 18, então use uma comparação de maior ou igual.", "Compare idade com 18 usando >=, porque a idade 18 também precisa passar.", "function podeDirigir(idade) {\n  if (idade >= 18) {\n    return true;\n  } else {\n    return false;\n  }\n}"],
                tests: [{ args: [18], exp: true }, { args: [17], exp: false }, { args: [25], exp: true }]
            },
            {
                title: "Aprovado ou reprovado", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'aprovado' para nota maior ou igual a 7; caso contrário, 'reprovado'.", sig: "function resultado(nota) { ... }", starter: "function resultado(nota) {\n\n}", fn: "resultado", difficulty: "medio", xp: 180, skill: "if e else com regra de negócio",
                hints: ["Pense na nota mínima necessária para cada resultado.", "Compare a nota com 7 usando >= e escolha entre os dois resultados.", "A condição central é nota >= 7; dependendo dela, retorne um dos dois textos pedidos.", "function resultado(nota) {\n  if (nota >= 7) {\n    return 'aprovado';\n  } else {\n    return 'reprovado';\n  }\n}"],
                tests: [{ args: [8], exp: "aprovado" }, { args: [7], exp: "aprovado" }, { args: [6.9], exp: "reprovado" }]
            },
            {
                title: "Desconto na compra", conceptIds: ["conditionals","comparisons","multiplication"], desc: "Dê 10% de desconto quando o valor for maior ou igual a 100. Caso contrário, mantenha o valor.", sig: "function precoFinal(valor) { ... }", starter: "function precoFinal(valor) {\n  // escolha qual caminho seguir\n\n}", fn: "precoFinal", difficulty: "medio", xp: 220, skill: "condição com cálculo",
                hints: ["Pense primeiro em quando o desconto deve acontecer.", "Se o valor for pelo menos 100, o cliente paga 90% do preço.", "Quando valor >= 100, o preço final representa 90% do original; quando não, mantenha o valor.", "function precoFinal(valor) {\n  if (valor >= 100) {\n    return valor * 0.9;\n  } else {\n    return valor;\n  }\n}"],
                tests: [{ args: [100], exp: 90 }, { args: [250], exp: 225 }, { args: [80], exp: 80 }]
            },
            {
                title: "Classificação de temperatura", conceptIds: ["conditionals","comparisons"], desc: "Retorne 'frio' abaixo de 15, 'agradavel' de 15 até 29 e 'quente' a partir de 30.", sig: "function classificarTemperatura(t) { ... }", starter: "function classificarTemperatura(t) {\n  // existem três caminhos\n\n}", fn: "classificarTemperatura", difficulty: "dificil", xp: 300, skill: "múltiplas condições com else if",
                hints: ["Pense nas três faixas de temperatura da missão.", "Verifique primeiro abaixo de 15, depois abaixo de 30; o restante é quente.", "As faixas podem ser resolvidas em ordem crescente: abaixo de 15, abaixo de 30 e, por fim, o restante.", "function classificarTemperatura(t) {\n  if (t < 15) {\n    return 'frio';\n  } else if (t < 30) {\n    return 'agradavel';\n  }\n\n  return 'quente';\n}"],
                tests: [{ args: [10], exp: "frio" }, { args: [15], exp: "agradavel" }, { args: [30], exp: "quente" }]
            },
            {
                title: "Compra aprovada", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne true somente quando o valor da compra for 50 ou mais e o pagamento estiver aprovado.", sig: "function compraAprovada(valor, pagamentoAprovado) { ... }", starter: "function compraAprovada(valor, pagamentoAprovado) {\n\n}", fn: "compraAprovada", difficulty: "dificil", xp: 320, skill: "combinar duas condições com &&",
                hints: ["Pense nas duas regras que precisam ser verdadeiras ao mesmo tempo.", "Compare o valor com 50 e use a informação sobre o pagamento aprovado.", "As duas condições precisam ser verdadeiras: valor >= 50 e pagamentoAprovado. Use && para combiná-las.", "function compraAprovada(valor, pagamentoAprovado) {\n  if (valor >= 50 && pagamentoAprovado) {\n    return true;\n  }\n\n  return false;\n}"],
                tests: [{ args: [50, true], exp: true }, { args: [49.99, true], exp: false }, { args: [100, false], exp: false }, { args: [80, true], exp: true }]
            },
            {
                title: "Frete grátis", conceptIds: ["comparisons","booleanLogic","conditionals"], desc: "Retorne 'gratis' se a compra for 200 ou mais ou se o cliente for assinante. Caso contrário, retorne 'pago'.", sig: "function tipoFrete(valor, assinante) { ... }", starter: "function tipoFrete(valor, assinante) {\n\n}", fn: "tipoFrete", difficulty: "dificil", xp: 350, skill: "combinar condições com ||",
                hints: ["Pense nas duas situações que liberam o frete grátis.", "Use || porque basta a compra atingir 200 ou o cliente ser assinante.", "Como basta uma das regras, use uma condição com OR entre valor >= 200 e assinante.", "function tipoFrete(valor, assinante) {\n  if (valor >= 200 || assinante) {\n    return 'gratis';\n  } else {\n    return 'pago';\n  }\n}"],
                tests: [{ args: [200, false], exp: "gratis" }, { args: [250, false], exp: "gratis" }, { args: [100, true], exp: "gratis" }, { args: [100, false], exp: "pago" }]
            },
            {
                title: "BOSS · Classificador de acesso", conceptIds: ["conditionals","comparisons","booleanLogic"], desc: "Classifique o acesso: 'bloqueado' se a conta estiver inativa; 'admin' se estiver ativa e for admin; 'usuario' nos demais casos.", sig: "function classificarAcesso(ativo, admin) { ... }", starter: "function classificarAcesso(ativo, admin) {\n  // pense na ordem das condições\n\n}", fn: "classificarAcesso", difficulty: "boss", xp: 550, skill: "ordenar múltiplas condições",
                hints: ["Pense na ordem das regras: conta inativa, admin ativo e usuário ativo.", "Trate o caso inativo primeiro; depois verifique admin e, por fim, o usuário comum.", "Trate a conta inativa primeiro; se estiver ativa, admin define o segundo caminho e o restante é usuário.", "function classificarAcesso(ativo, admin) {\n  if (!ativo) {\n    return 'bloqueado';\n  } else if (admin) {\n    return 'admin';\n  }\n\n  return 'usuario';\n}"],
                tests: [{ args: [false, true], exp: "bloqueado" }, { args: [true, true], exp: "admin" }, { args: [true, false], exp: "usuario" }]
            }
        ]
    },
    {
        name: "Loops", tag: "N3", exercises: [
            {
                title: "Soma até N", conceptIds: ["loops","accumulators"], desc: "Retorne a soma de todos os números inteiros de 1 até n.", sig: "function somaAte(n) { ... }", starter: "function somaAte(n) {\n  let total = 0;\n\n  // some 1, 2, 3... até n\n}", fn: "somaAte", difficulty: "facil", xp: 120, skill: "usar um laço para acumular valores",
                hints: ["Pense em como repetir uma operação para todos os números até n.", "Use um acumulador começando em 0 e um for de 1 até n.", "Crie o for com i começando em 1, avance enquanto i <= n e some cada i ao total.", "function somaAte(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [1], exp: 1 }, { args: [5], exp: 15 }, { args: [10], exp: 55 }, { args: [0], exp: 0 }]
            },
            {
                title: "Contando pares", conceptIds: ["loops","counters","conditionals","remainder"], desc: "Conte quantos números pares existem de 1 até n.", sig: "function contarPares(n) { ... }", starter: "function contarPares(n) {\n  let quantidade = 0;\n\n  // conte os números pares\n}", fn: "contarPares", difficulty: "facil", xp: 120, skill: "usar contador, laço e resto da divisão",
                hints: ["Pense em uma variável que conte quantos pares foram encontrados.", "Percorra de 1 até n e aumente o contador quando i % 2 === 0.", "Faça o for de 1 até n e, dentro dele, use uma condição para incrementar quantidade apenas nos pares.", "function contarPares(n) {\n  let quantidade = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: [1], exp: 0 }, { args: [6], exp: 3 }, { args: [10], exp: 5 }]
            },
            {
                title: "Soma dos múltiplos de 3", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma dos números entre 1 e n que são múltiplos de 3.", sig: "function somaMultiplosDe3(n) { ... }", starter: "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  // encontre os múltiplos de 3\n}", fn: "somaMultiplosDe3", difficulty: "medio", xp: 180, skill: "combinar laço, condição e acumulador",
                hints: ["Pense em como identificar números divisíveis por 3 durante uma repetição.", "Percorra de 1 até n e some apenas os valores cujo resto por 3 seja 0.", "Dentro do for, teste i % 3 === 0 e só então acrescente i ao acumulador.", "function somaMultiplosDe3(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0) total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [3], exp: 3 }, { args: [10], exp: 18 }, { args: [15], exp: 45 }]
            },
            {
                title: "Soma dos ímpares", conceptIds: ["loops","accumulators","conditionals","remainder"], desc: "Retorne a soma de todos os números ímpares de 1 até n.", sig: "function somaImpares(n) { ... }", starter: "function somaImpares(n) {\n  let total = 0;\n\n  // some apenas os ímpares\n}", fn: "somaImpares", difficulty: "medio", xp: 180, skill: "filtrar valores dentro de um laço",
                hints: ["Pense em como identificar um número que não é divisível por 2.", "Percorra de 1 até n e some os valores cujo resto por 2 seja diferente de 0.", "Dentro do for, identifique os ímpares com i % 2 !== 0 e acrescente apenas esses valores ao total.", "function somaImpares(n) {\n  let total = 0;\n\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 !== 0) total += i;\n  }\n\n  return total;\n}"],
                tests: [{ args: [5], exp: 9 }, { args: [10], exp: 25 }, { args: [1], exp: 1 }]
            },
            {
                title: "Fatorial", conceptIds: ["loops","accumulators"], desc: "Retorne o fatorial de n. Considere que 0! = 1.", sig: "function fatorial(n) { ... }", starter: "function fatorial(n) {\n  let resultado = 1;\n\n  // multiplique pelos números de 1 até n\n}", fn: "fatorial", difficulty: "medio", xp: 220, skill: "usar acumulador para multiplicação",
                hints: ["Pense em uma multiplicação que vai crescendo a cada volta.", "Comece o resultado em 1 e multiplique pelo contador de 1 até n.", "Use um acumulador iniciado em 1 e multiplique-o pelo contador a cada volta do for.", "function fatorial(n) {\n  let resultado = 1;\n\n  for (let i = 1; i <= n; i++) {\n    resultado *= i;\n  }\n\n  return resultado;\n}"],
                tests: [{ args: [0], exp: 1 }, { args: [4], exp: 24 }, { args: [6], exp: 720 }]
            },
            {
                title: "Soma de uma lista", conceptIds: ["loops","accumulators","iteration"], desc: "A lista já vem pronta. Percorra seus valores e retorne a soma de todos eles.", sig: "function somarLista(valores) { ... }", starter: "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista usando um índice\n}", fn: "somarLista", difficulty: "medio", xp: 220, skill: "percorrer uma lista com um laço",
                hints: ["Pense em como visitar cada posição da lista e acumular os valores.", "Use um índice de 0 até antes de valores.length e some valores[i].", "Percorra os índices da lista de 0 até valores.length - 1 e acrescente cada valores[i] ao total.", "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}"],
                tests: [{ args: [[]], exp: 0 }, { args: [[2, 3, 5]], exp: 10 }, { args: [[10, -2, 4]], exp: 12 }, { args: [[7]], exp: 7 }]
            },
            {
                title: "Média da lista", conceptIds: ["loops","accumulators","iteration","division"], desc: "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.", sig: "function mediaLista(valores) { ... }", starter: "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}", fn: "mediaLista", difficulty: "dificil", xp: 280, skill: "combinar percurso, acumulador e divisão",
                hints: ["Pense em como calcular uma média usando uma soma e uma quantidade.", "Some todos os valores e depois divida pelo tamanho da lista.", "Faça a mesma soma percorrendo a lista e, depois do laço, divida o total por valores.length.", "function mediaLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total / valores.length;\n}"],
                tests: [{ args: [[2, 4, 6]], exp: 4 }, { args: [[10, 20]], exp: 15 }, { args: [[5]], exp: 5 }]
            },
            {
                title: "Maior valor da lista", conceptIds: ["loops","iteration","comparisons"], desc: "Percorra a lista e retorne o maior valor encontrado.", sig: "function maiorValor(valores) { ... }", starter: "function maiorValor(valores) {\n  let maior = valores[0];\n\n  // compare os próximos valores com maior\n}", fn: "maiorValor", difficulty: "dificil", xp: 300, skill: "percorrer valores e manter o maior encontrado",
                hints: ["Pense em guardar o maior valor encontrado até cada momento.", "Comece com valores[0] e substitua maior sempre que encontrar um valor maior.", "Comece com valores[0] como maior e compare os próximos itens, substituindo o valor quando encontrar um maior.", "function maiorValor(valores) {\n  let maior = valores[0];\n\n  for (let i = 1; i < valores.length; i++) {\n    if (valores[i] > maior) maior = valores[i];\n  }\n\n  return maior;\n}"],
                tests: [{ args: [[3, 8, 2]], exp: 8 }, { args: [[-5, -2, -9]], exp: -2 }, { args: [[10, 10, 4]], exp: 10 }]
            },
            {
                title: "Acima do limite", conceptIds: ["loops","counters","iteration","comparisons"], desc: "Conte quantos valores da lista são maiores que o limite informado.", sig: "function contarAcima(valores, limite) { ... }", starter: "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  // conte os valores maiores que limite\n}", fn: "contarAcima", difficulty: "dificil", xp: 350, skill: "combinar contador, comparação e percurso",
                hints: ["Pense em contar apenas os valores que passam do limite.", "Percorra a lista, compare cada valor com limite e aumente quantidade quando for maior.", "Percorra a lista e incremente quantidade somente quando valores[i] for maior que limite.", "function contarAcima(valores, limite) {\n  let quantidade = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] > limite) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: [[2, 5, 8, 1], 4], exp: 2 }, { args: [[10, 10, 3], 10], exp: 0 }, { args: [[-1, 0, 4], -2], exp: 3 }]
            },
            {
                title: "BOSS · Maior salto", conceptIds: ["loops","iteration","comparisons","accumulators"], desc: "Uma lista representa valores registrados em sequência. Retorne a maior diferença absoluta entre dois valores consecutivos. Com uma lista de um único item, retorne 0.", sig: "function maiorSalto(valores) { ... }", starter: "function maiorSalto(valores) {\n  let maior = 0;\n\n  // compare cada valor com o anterior\n}", fn: "maiorSalto", difficulty: "boss", xp: 550, skill: "combinar percurso, comparação e atualização de um melhor resultado",
                hints: ["Pense em comparar cada valor com o valor que veio imediatamente antes.", "Calcule a diferença absoluta entre vizinhos e guarde apenas o maior salto encontrado.", "Comece em zero, compare cada item com o anterior usando Math.abs e atualize maior quando o salto for maior.", "function maiorSalto(valores) {\n  let maior = 0;\n\n  for (let i = 1; i < valores.length; i++) {\n    const salto = Math.abs(valores[i] - valores[i - 1]);\n    if (salto > maior) maior = salto;\n  }\n\n  return maior;\n}"],
                tests: [{ args: [[10]], exp: 0 }, { args: [[10, 4, 12, 7]], exp: 8 }, { args: [[-5, -1, -9]], exp: 8 }]
            }
        ]
    },
    {
        name: "Strings", tag: "N4", exercises: [
            {
                title: "Tamanho do texto", conceptIds: ["strings","stringLength"], desc: "Retorne quantos caracteres existem em texto.", sig: "function tamanho(texto) { ... }", starter: "function tamanho(texto) {\n  // descubra quantos caracteres existem\n}", fn: "tamanho", difficulty: "facil", xp: 120, skill: "usar length para descobrir o tamanho de uma string",
                hints: ["Pense em qual informação a própria string fornece sobre seu tamanho.", "Use a propriedade length do texto.", "Retorne diretamente texto.length.", "function tamanho(texto) {\n  return texto.length;\n}"],
                tests: [{ args: ["CodeMpi"], exp: 7 }, { args: [""], exp: 0 }, { args: ["programar"], exp: 9 }]
            },
            {
                title: "Primeira letra", conceptIds: ["strings","stringIndex"], desc: "Retorne o primeiro caractere de texto.", sig: "function primeiraLetra(texto) { ... }", starter: "function primeiraLetra(texto) {\n  // acesse a primeira posição\n}", fn: "primeiraLetra", difficulty: "facil", xp: 120, skill: "acessar o primeiro caractere usando índice",
                hints: ["Lembre que a primeira posição começa em 0.", "Use os colchetes para acessar o índice 0.", "A primeira letra está em texto[0].", "function primeiraLetra(texto) {\n  return texto[0];\n}"],
                tests: [{ args: ["CodeMpi"], exp: "C" }, { args: ["JavaScript"], exp: "J" }, { args: ["a"], exp: "a" }]
            },
            {
                title: "Última letra", conceptIds: ["strings","stringLength","stringIndex"], desc: "Retorne o último caractere de texto.", sig: "function ultimaLetra(texto) { ... }", starter: "function ultimaLetra(texto) {\n  // encontre o último índice\n}", fn: "ultimaLetra", difficulty: "facil", xp: 140, skill: "combinar length e índice para acessar a última posição",
                hints: ["O último índice não é igual ao tamanho da string.", "Comece pensando em length e lembre que a contagem dos índices começa em 0.", "O último índice é texto.length - 1; use-o entre colchetes.", "function ultimaLetra(texto) {\n  return texto[texto.length - 1];\n}"],
                tests: [{ args: ["CodeMpi"], exp: "i" }, { args: ["JavaScript"], exp: "t" }, { args: ["a"], exp: "a" }]
            },
            {
                title: "Tudo em maiúsculas", conceptIds: ["strings","stringCase"], desc: "Retorne texto com todas as letras em maiúsculas.", sig: "function maiusculas(texto) { ... }", starter: "function maiusculas(texto) {\n  // transforme o texto\n}", fn: "maiusculas", difficulty: "medio", xp: 160, skill: "transformar uma string usando toUpperCase",
                hints: ["Pense em qual transformação da aula deixa todas as letras em caixa alta.", "Use o método toUpperCase na string.", "Chame texto.toUpperCase() e retorne o resultado.", "function maiusculas(texto) {\n  return texto.toUpperCase();\n}"],
                tests: [{ args: ["codempi"], exp: "CODEMPI" }, { args: ["Code Mpi"], exp: "CODE MPI" }, { args: [""], exp: "" }]
            },
            {
                title: "Tudo em minúsculas", conceptIds: ["strings","stringCase"], desc: "Retorne texto com todas as letras em minúsculas.", sig: "function minusculas(texto) { ... }", starter: "function minusculas(texto) {\n  // transforme o texto\n}", fn: "minusculas", difficulty: "medio", xp: 160, skill: "transformar uma string usando toLowerCase",
                hints: ["Agora pense na transformação oposta à missão anterior.", "Use o método toLowerCase na string.", "Chame texto.toLowerCase() e retorne o resultado.", "function minusculas(texto) {\n  return texto.toLowerCase();\n}"],
                tests: [{ args: ["CODEMPI"], exp: "codempi" }, { args: ["Code MPI"], exp: "code mpi" }, { args: [""], exp: "" }]
            },
            {
                title: "Contando um caractere", conceptIds: ["strings","stringIteration","counters"], desc: "Retorne quantas vezes o caractere alvo aparece em texto. A comparação deve ser exata.", sig: "function contarCaractere(texto, alvo) { ... }", starter: "function contarCaractere(texto, alvo) {\n  let quantidade = 0;\n\n  // percorra o texto e conte o alvo\n}", fn: "contarCaractere", difficulty: "medio", xp: 240, skill: "percorrer uma string e usar um contador para contar ocorrências",
                hints: ["Pense no mesmo padrão de contador que você usou no N3.", "Percorra os índices de 0 até texto.length e aumente o contador quando o caractere atual for igual ao alvo.", "Dentro do for, compare texto[i] com alvo usando === e faça quantidade++ quando forem iguais.", "function contarCaractere(texto, alvo) {\n  let quantidade = 0;\n\n  for (let i = 0; i < texto.length; i++) {\n    if (texto[i] === alvo) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: ["banana", "a"], exp: 3 }, { args: ["CodeMpi", "o"], exp: 1 }, { args: ["banana", "x"], exp: 0 }, { args: ["", "a"], exp: 0 }]
            },
            {
                title: "Inverter texto", conceptIds: ["strings","stringIteration"], desc: "Retorne texto escrito de trás para frente.", sig: "function inverter(texto) { ... }", starter: "function inverter(texto) {\n  let resultado = \"\";\n\n  // construa o texto invertido\n}", fn: "inverter", difficulty: "dificil", xp: 320, skill: "percorrer uma string e construir um novo texto caractere por caractere",
                hints: ["Pense em construir uma segunda string enquanto percorre a original.", "Para inverter, visite o texto do último índice até o primeiro.", "Comece no índice texto.length - 1, diminua até 0 e acrescente texto[i] a resultado.", "function inverter(texto) {\n  let resultado = \"\";\n\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado += texto[i];\n  }\n\n  return resultado;\n}"],
                tests: [{ args: ["casa"], exp: "asac" }, { args: ["CodeMpi"], exp: "ipMedoC" }, { args: [""], exp: "" }, { args: ["a"], exp: "a" }]
            },
            {
                title: "Substituir ocorrências", conceptIds: ["strings","stringReplacement"], desc: "Retorne texto com todas as ocorrências de alvo substituídas por novo.", sig: "function substituir(texto, alvo, novo) { ... }", starter: "function substituir(texto, alvo, novo) {\n  // substitua todas as ocorrências\n}", fn: "substituir", difficulty: "dificil", xp: 320, skill: "substituir todas as ocorrências de um trecho em uma string",
                hints: ["Pense no método que a aula apresentou para trocar partes do texto.", "Use replaceAll para informar o que deve sair e o que deve entrar.", "Retorne texto.replaceAll(alvo, novo).", "function substituir(texto, alvo, novo) {\n  return texto.replaceAll(alvo, novo);\n}"],
                tests: [{ args: ["banana", "a", "o"], exp: "bonono" }, { args: ["CodeMpi", "M", "m"], exp: "Codempi" }, { args: ["aaaa", "aa", "b"], exp: "bb" }, { args: ["abc", "x", "y"], exp: "abc" }]
            },
            {
                title: "Textos iguais", conceptIds: ["strings","stringComparison"], desc: "Retorne true somente quando textoA e textoB forem exatamente iguais.", sig: "function iguais(textoA, textoB) { ... }", starter: "function iguais(textoA, textoB) {\n  // faça uma comparação exata\n}", fn: "iguais", difficulty: "medio", xp: 340, skill: "comparar duas strings usando igualdade exata",
                hints: ["Pense no operador usado na aula para verificar igualdade exata.", "Use === entre os dois textos.", "A comparação direta é textoA === textoB.", "function iguais(textoA, textoB) {\n  return textoA === textoB;\n}"],
                tests: [{ args: ["CodeMpi", "CodeMpi"], exp: true }, { args: ["CodeMpi", "codempi"], exp: false }, { args: ["abc", "abcd"], exp: false }, { args: ["", ""], exp: true }]
            },
            {
                title: "BOSS · É palíndromo?", conceptIds: ["strings","stringIteration","stringComparison","palindrome"], desc: "Retorne true se texto for igual ao próprio texto escrito de trás para frente. Considere apenas textos em minúsculas e sem espaços.", sig: "function ehPalindromo(texto) { ... }", starter: "function ehPalindromo(texto) {\n  // compare o texto com sua versão invertida\n}", fn: "ehPalindromo", difficulty: "boss", xp: 550, skill: "combinar percurso, construção de string e comparação",
                hints: ["Pense no que precisa ser verdade para um texto ser palíndromo.", "Construa uma versão invertida do texto usando o padrão da missão anterior.", "Percorra do último caractere ao primeiro, monte o invertido e compare com texto usando ===.", "function ehPalindromo(texto) {\n  let invertido = \"\";\n\n  for (let i = texto.length - 1; i >= 0; i--) {\n    invertido += texto[i];\n  }\n\n  return texto === invertido;\n}"],
                tests: [{ args: ["arara"], exp: true }, { args: ["radar"], exp: true }, { args: ["casa"], exp: false }, { args: ["codempi"], exp: false }, { args: ["a"], exp: true }, { args: [""], exp: true }]
            }
        ]
    },
        {
        name: "Arrays", tag: "N5", exercises: [
            {
                title: "Primeiro elemento", conceptIds: ["arrays","arrayIndex"], desc: "Retorne o primeiro valor da lista.", sig: "function primeiro(valores) { ... }", starter: "function primeiro(valores) {\n  // acesse a primeira posição\n}", fn: "primeiro", difficulty: "facil", xp: 120, skill: "acessar uma posição de um array usando índice",
                hints: ["Lembre que a primeira posição de uma lista começa em 0.", "Use os colchetes para acessar uma posição específica.", "A primeira posição está em valores[0].", "function primeiro(valores) {\n  return valores[0];\n}"],
                tests: [{ args: [[10, 20, 30]], exp: 10 }, { args: [[5]], exp: 5 }, { args: [[-2, 8]], exp: -2 }]
            },
            {
                title: "Último elemento", conceptIds: ["arrays","arrayIndex","arrayLength"], desc: "Retorne o último valor da lista.", sig: "function ultimo(valores) { ... }", starter: "function ultimo(valores) {\n  // encontre o último índice\n}", fn: "ultimo", difficulty: "facil", xp: 140, skill: "combinar length e índice para acessar o último item",
                hints: ["Pense na relação entre quantidade de itens e índice.", "O tamanho está em valores.length, mas o último índice é um a menos.", "Acesse valores usando o índice valores.length - 1.", "function ultimo(valores) {\n  return valores[valores.length - 1];\n}"],
                tests: [{ args: [[10, 20, 30]], exp: 30 }, { args: [[5]], exp: 5 }, { args: [[-2, 8, 4]], exp: 4 }]
            },
            {
                title: "Somar a lista", conceptIds: ["arrays","arrayIteration","accumulators"], desc: "Percorra a lista e retorne a soma de todos os seus valores.", sig: "function somarLista(valores) { ... }", starter: "function somarLista(valores) {\n  let total = 0;\n\n  // percorra a lista e acumule os valores\n}", fn: "somarLista", difficulty: "medio", xp: 180, skill: "combinar array, for e acumulador",
                hints: ["Pense no acumulador que você já usou no N3.", "Percorra os índices da lista e some cada valores[i] ao total.", "Use for com i começando em 0, enquanto i < valores.length, e faça total += valores[i].", "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}"],
                tests: [{ args: [[]], exp: 0 }, { args: [[2, 3, 5]], exp: 10 }, { args: [[10, -2, 4]], exp: 12 }, { args: [[7]], exp: 7 }]
            },
            {
                title: "Contar positivos", conceptIds: ["arrays","arrayIteration","counters","comparisons"], desc: "Retorne quantos valores da lista são maiores que zero.", sig: "function contarPositivos(valores) { ... }", starter: "function contarPositivos(valores) {\n  let quantidade = 0;\n\n  // conte os valores positivos\n}", fn: "contarPositivos", difficulty: "medio", xp: 200, skill: "combinar contador, condição e percurso de array",
                hints: ["Pense no padrão de contador aprendido no N3.", "Percorra a lista e aumente a quantidade quando o valor for maior que zero.", "Dentro do for, use if (valores[i] > 0) e faça quantidade++.", "function contarPositivos(valores) {\n  let quantidade = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] > 0) quantidade++;\n  }\n\n  return quantidade;\n}"],
                tests: [{ args: [[]], exp: 0 }, { args: [[-2, 4, 7]], exp: 2 }, { args: [[-5, -1]], exp: 0 }, { args: [[1, 2, 3]], exp: 3 }]
            },
            {
                title: "Média da lista", conceptIds: ["arrays","arrayIteration","accumulators","division"], desc: "Retorne a média aritmética dos valores da lista. Os testes sempre fornecem pelo menos um valor.", sig: "function mediaLista(valores) { ... }", starter: "function mediaLista(valores) {\n  let total = 0;\n\n  // some os valores e depois divida pela quantidade\n}", fn: "mediaLista", difficulty: "medio", xp: 240, skill: "combinar soma, length e divisão",
                hints: ["Uma média depende de uma soma e da quantidade de valores.", "Some os itens e depois divida pelo tamanho do array.", "Depois do for, retorne total / valores.length.", "function mediaLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total / valores.length;\n}"],
                tests: [{ args: [[2, 4, 6]], exp: 4 }, { args: [[10, 20]], exp: 15 }, { args: [[5]], exp: 5 }, { args: [[-4, 0, 10]], exp: 2 }]
            },
            {
                title: "Menor valor", conceptIds: ["arrays","arrayIteration","comparisons"], desc: "Percorra a lista e retorne o menor valor encontrado.", sig: "function menorValor(valores) { ... }", starter: "function menorValor(valores) {\n  let menor = valores[0];\n\n  // compare os próximos valores com menor\n}", fn: "menorValor", difficulty: "dificil", xp: 280, skill: "manter o menor valor encontrado durante um percurso",
                hints: ["Pense no mesmo padrão usado para encontrar um maior valor.", "Comece com valores[0] e substitua menor quando encontrar um valor menor.", "Percorra a partir do índice 1 e, quando valores[i] < menor, atualize menor.", "function menorValor(valores) {\n  let menor = valores[0];\n\n  for (let i = 1; i < valores.length; i++) {\n    if (valores[i] < menor) menor = valores[i];\n  }\n\n  return menor;\n}"],
                tests: [{ args: [[3, 8, 2]], exp: 2 }, { args: [[-5, -2, -9]], exp: -9 }, { args: [[10, 10, 4]], exp: 4 }, { args: [[7]], exp: 7 }]
            },
            {
                title: "Contém o valor", conceptIds: ["arrays","arrayIteration","arraySearch","comparisons"], desc: "Retorne true quando alvo estiver na lista e false quando não estiver.", sig: "function contemValor(valores, alvo) { ... }", starter: "function contemValor(valores, alvo) {\n  // procure o valor na lista\n}", fn: "contemValor", difficulty: "dificil", xp: 300, skill: "percorrer uma lista e interromper a busca quando encontrar o alvo",
                hints: ["Pense em verificar cada posição até encontrar o valor procurado.", "Percorra o array e compare cada item com alvo usando ===.", "Quando valores[i] === alvo, você já pode retornar true; se o laço terminar, retorne false.", "function contemValor(valores, alvo) {\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] === alvo) {\n      return true;\n    }\n  }\n\n  return false;\n}"],
                tests: [{ args: [[2, 5, 8], 5], exp: true }, { args: [[2, 5, 8], 7], exp: false }, { args: [[], 10], exp: false }, { args: [[1, 1, 2], 1], exp: true }]
            },
            {
                title: "Apenas pares", conceptIds: ["arrays","arrayIteration","arrayPush","arrayFilter","remainder"], desc: "Retorne uma nova lista contendo apenas os valores pares, na mesma ordem em que aparecem.", sig: "function apenasPares(valores) { ... }", starter: "function apenasPares(valores) {\n  const resultado = [];\n\n  // coloque na nova lista somente os pares\n}", fn: "apenasPares", difficulty: "dificil", xp: 340, skill: "percorrer, filtrar com if e construir um novo array",
                hints: ["Você precisa construir outra lista sem alterar a original.", "Comece com [] e, durante o percurso, escolha quais valores devem entrar.", "Quando valores[i] % 2 === 0, use resultado.push(valores[i]).", "function apenasPares(valores) {\n  const resultado = [];\n\n  for (let i = 0; i < valores.length; i++) {\n    if (valores[i] % 2 === 0) {\n      resultado.push(valores[i]);\n    }\n  }\n\n  return resultado;\n}"],
                tests: [{ args: [[]], exp: [] }, { args: [[1, 2, 3, 4]], exp: [2, 4] }, { args: [[1, 3, 5]], exp: [] }, { args: [[2, 4]], exp: [2, 4] }]
            },
            {
                title: "Inverter lista", conceptIds: ["arrays","arrayIteration","arrayPush","arrayReverse"], desc: "Retorne uma nova lista com os valores em ordem inversa.", sig: "function inverterLista(valores) { ... }", starter: "function inverterLista(valores) {\n  const resultado = [];\n\n  // percorra de trás para frente\n}", fn: "inverterLista", difficulty: "dificil", xp: 380, skill: "combinar índice regressivo e construção de novo array",
                hints: ["Pense no mesmo padrão de inversão que você usou no N4.", "Comece pelo último índice e diminua até chegar a zero.", "Use i = valores.length - 1; enquanto i >= 0; acrescente valores[i] com push.", "function inverterLista(valores) {\n  const resultado = [];\n\n  for (let i = valores.length - 1; i >= 0; i--) {\n    resultado.push(valores[i]);\n  }\n\n  return resultado;\n}"],
                tests: [{ args: [[]], exp: [] }, { args: [[1, 2, 3]], exp: [3, 2, 1] }, { args: [[10, 20]], exp: [20, 10] }, { args: [[5]], exp: [5] }]
            },
            {
                title: "BOSS · Remover duplicados", conceptIds: ["arrays","arrayIteration","arrayPush","arraySearch","arrayDuplicates"], desc: "Retorne uma nova lista contendo cada valor apenas uma vez, preservando a ordem da primeira aparição.", sig: "function removerDuplicados(valores) { ... }", starter: "function removerDuplicados(valores) {\n  const resultado = [];\n\n  // adicione um valor somente na primeira vez em que ele aparecer\n}", fn: "removerDuplicados", difficulty: "boss", xp: 550, skill: "combinar percurso, busca e construção de uma nova lista",
                hints: ["Pense em construir a resposta aos poucos, sem alterar a lista original.", "Antes de adicionar um valor, descubra se ele já está em resultado.", "Use resultado.includes(valores[i]) para verificar se o valor já apareceu; só faça push quando não estiver presente.", "function removerDuplicados(valores) {\n  const resultado = [];\n\n  for (let i = 0; i < valores.length; i++) {\n    if (!resultado.includes(valores[i])) {\n      resultado.push(valores[i]);\n    }\n  }\n\n  return resultado;\n}"],
                tests: [{ args: [[]], exp: [] }, { args: [[1, 2, 2, 3, 1]], exp: [1, 2, 3] }, { args: [[5, 5, 5]], exp: [5] }, { args: [[1, 2, 3]], exp: [1, 2, 3] }, { args: [[2, 1, 2, 1]], exp: [2, 1] }]
            }
        ]
    },
        {
        name: "Funções e Lógica", tag: "N6", exercises: [
            {
                title: "Preço com acréscimo", conceptIds: ["functions","parameters","localVariables","division"], desc: "Receba um valor e uma taxa percentual e retorne o valor com o acréscimo aplicado.", sig: "function precoComTaxa(valor, taxa) { ... }", starter: "function precoComTaxa(valor, taxa) {\n  // calcule o valor do acréscimo\n}", fn: "precoComTaxa", difficulty: "facil", xp: 120, skill: "usar parâmetros e uma variável local para construir um resultado",
                hints: ["Pense em quanto a taxa representa do valor original.", "Calcule o acréscimo usando valor * taxa / 100 e some-o ao valor.", "Guarde o resultado em uma variável, como total, e retorne valor + valor * taxa / 100.", "function precoComTaxa(valor, taxa) {\n  const total = valor + valor * taxa / 100;\n  return total;\n}"],
                tests: [{ args: [100, 10], exp: 110 }, { args: [80, 25], exp: 100 }, { args: [50, 0], exp: 50 }]
            },
            {
                title: "Está no intervalo", conceptIds: ["functions","parameters","booleanFunctions","comparisons","booleanLogic"], desc: "Retorne true quando numero estiver entre minimo e maximo, incluindo os dois limites.", sig: "function estaNoIntervalo(numero, minimo, maximo) { ... }", starter: "function estaNoIntervalo(numero, minimo, maximo) {\n  // verifique os dois limites\n}", fn: "estaNoIntervalo", difficulty: "medio", xp: 160, skill: "criar uma função booleana combinando comparações",
                hints: ["A pergunta precisa confirmar duas coisas ao mesmo tempo.", "Verifique se numero é maior ou igual a minimo e menor ou igual a maximo.", "Combine numero >= minimo e numero <= maximo com && e retorne o resultado.", "function estaNoIntervalo(numero, minimo, maximo) {\n  return numero >= minimo && numero <= maximo;\n}"],
                tests: [{ args: [5, 0, 10], exp: true }, { args: [-1, 0, 10], exp: false }, { args: [10, 0, 10], exp: true }, { args: [11, 0, 10], exp: false }]
            },
            {
                title: "Nota válida", conceptIds: ["functions","parameters","booleanFunctions","validation","booleanLogic"], desc: "Retorne true somente quando a nota estiver entre 0 e 10, incluindo os limites.", sig: "function notaValida(nota) { ... }", starter: "function notaValida(nota) {\n  // valide a entrada\n}", fn: "notaValida", difficulty: "medio", xp: 180, skill: "validar uma entrada com limites inclusivos",
                hints: ["Uma nota válida precisa obedecer aos dois limites.", "Verifique se nota não é menor que 0 e não é maior que 10.", "Use nota >= 0 && nota <= 10 e retorne diretamente o booleano.", "function notaValida(nota) {\n  return nota >= 0 && nota <= 10;\n}"],
                tests: [{ args: [0], exp: true }, { args: [7], exp: true }, { args: [10], exp: true }, { args: [-0.1], exp: false }, { args: [10.1], exp: false }]
            },
            {
                title: "Classificar nota", conceptIds: ["functions","parameters","validation","conditionals","comparisons","earlyReturn"], desc: "Classifique a nota: 'invalida' fora de 0 a 10; 'reprovado' abaixo de 5; 'recuperacao' de 5 até menos de 7; 'aprovado' de 7 a 10.", sig: "function classificarNota(nota) { ... }", starter: "function classificarNota(nota) {\n  // valide primeiro e depois classifique\n}", fn: "classificarNota", difficulty: "medio", xp: 240, skill: "ordenar validação e múltiplos caminhos dentro de uma função",
                hints: ["Separe o problema em duas partes: entrada válida e classificação.", "Trate primeiro valores menores que 0 ou maiores que 10; depois use as faixas 5 e 7.", "Faça um retorno antecipado para notas inválidas; em seguida use if/else if para reprovado, recuperação e aprovado.", "function classificarNota(nota) {\n  if (nota < 0 || nota > 10) return 'invalida';\n  if (nota < 5) return 'reprovado';\n  if (nota < 7) return 'recuperacao';\n  return 'aprovado';\n}"],
                tests: [{ args: [-1], exp: "invalida" }, { args: [0], exp: "reprovado" }, { args: [5], exp: "recuperacao" }, { args: [6.9], exp: "recuperacao" }, { args: [7], exp: "aprovado" }, { args: [10], exp: "aprovado" }, { args: [10.1], exp: "invalida" }]
            },
            {
                title: "Preço com desconto progressivo", conceptIds: ["functions","parameters","localVariables","conditionals","comparisons","multiplication"], desc: "Retorne o preço final: sem desconto abaixo de 100, 10% de desconto de 100 até 199,99 e 20% de desconto a partir de 200.", sig: "function precoComDesconto(valor) { ... }", starter: "function precoComDesconto(valor) {\n  // escolha a faixa de desconto\n}", fn: "precoComDesconto", difficulty: "dificil", xp: 280, skill: "combinar condição, cálculo percentual e variável local",
                hints: ["Existem três faixas de preço.", "Descubra primeiro qual percentual se aplica e depois calcule o preço final.", "Use 0% abaixo de 100, 10% a partir de 100 e 20% a partir de 200; depois aplique o percentual ao valor.", "function precoComDesconto(valor) {\n  let desconto = 0;\n\n  if (valor >= 200) {\n    desconto = 20;\n  } else if (valor >= 100) {\n    desconto = 10;\n  }\n\n  return valor * (1 - desconto / 100);\n}"],
                tests: [{ args: [80], exp: 80 }, { args: [100], exp: 90 }, { args: [150], exp: 135 }, { args: [200], exp: 160 }, { args: [250], exp: 200 }]
            },
            {
                title: "Montante com juros simples", conceptIds: ["functions","parameters","localVariables","multiplication","division"], desc: "Retorne o montante final usando juros simples: principal + principal × taxa × meses / 100. A taxa é informada em porcentagem.", sig: "function montanteJuros(principal, taxa, meses) { ... }", starter: "function montanteJuros(principal, taxa, meses) {\n  // calcule os juros e some ao principal\n}", fn: "montanteJuros", difficulty: "dificil", xp: 300, skill: "dividir uma fórmula em etapas com variáveis locais",
                hints: ["Pense primeiro em calcular somente os juros.", "Os juros são principal × taxa × meses / 100; depois some esse valor ao principal.", "Use uma variável juros para a fórmula e retorne principal + juros.", "function montanteJuros(principal, taxa, meses) {\n  const juros = principal * taxa * meses / 100;\n  return principal + juros;\n}"],
                tests: [{ args: [1000, 2, 3], exp: 1060 }, { args: [500, 5, 4], exp: 600 }, { args: [100, 0, 12], exp: 100 }]
            },
            {
                title: "Fibonacci", conceptIds: ["functions","parameters","localVariables","loops","accumulators"], desc: "Retorne o n-ésimo número da sequência de Fibonacci. Considere F(0) = 0 e F(1) = 1.", sig: "function fibonacci(n) { ... }", starter: "function fibonacci(n) {\n  // construa a sequência até chegar em n\n}", fn: "fibonacci", difficulty: "dificil", xp: 360, skill: "combinar função, laço e atualização de vários valores",
                hints: ["Comece pelos dois primeiros valores: 0 e 1.", "A cada passo, o próximo valor é a soma dos dois anteriores.", "Guarde dois valores, some-os para obter o próximo e avance as duas variáveis até chegar à posição n.", "function fibonacci(n) {\n  if (n === 0) return 0;\n  if (n === 1) return 1;\n\n  let anterior = 0;\n  let atual = 1;\n\n  for (let i = 2; i <= n; i++) {\n    const proximo = anterior + atual;\n    anterior = atual;\n    atual = proximo;\n  }\n\n  return atual;\n}"],
                tests: [{ args: [0], exp: 0 }, { args: [1], exp: 1 }, { args: [2], exp: 1 }, { args: [6], exp: 8 }, { args: [10], exp: 55 }]
            },
            {
                title: "Total da lista com taxa", conceptIds: ["functions","parameters","functionComposition","arrayIteration","accumulators"], desc: "Crie a função somarLista para somar um array e use-a dentro de totalComTaxa para aplicar uma taxa percentual ao subtotal.", sig: "function totalComTaxa(valores, taxa) { ... }", starter: "function somarLista(valores) {\n  // reutilize o padrão do N5\n}\n\nfunction totalComTaxa(valores, taxa) {\n  // use somarLista aqui\n}", fn: "totalComTaxa", difficulty: "dificil", xp: 380, skill: "reutilizar uma função auxiliar dentro de outra",
                hints: ["Divida o problema: primeiro obtenha o subtotal, depois aplique a taxa.", "A função totalComTaxa não precisa percorrer a lista novamente se somarLista já fizer isso.", "Complete somarLista, chame-a dentro de totalComTaxa, guarde o subtotal e retorne subtotal + subtotal * taxa / 100.", "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}\n\nfunction totalComTaxa(valores, taxa) {\n  const subtotal = somarLista(valores);\n  return subtotal + subtotal * taxa / 100;\n}"],
                tests: [{ args: [[10, 20], 10], exp: 33 }, { args: [[100, 50], 20], exp: 180 }, { args: [[], 10], exp: 0 }, { args: [[5, -2], 10], exp: 3.3 }]
            },
            {
                title: "Taxa de aprovação", conceptIds: ["functions","parameters","functionComposition","arrayIteration","counters","comparisons","division"], desc: "Crie contarAprovados(notas, minimo) e use-a dentro de taxaAprovacao para retornar a porcentagem de notas aprovadas. Lista vazia retorna 0.", sig: "function taxaAprovacao(notas, minimo) { ... }", starter: "function contarAprovados(notas, minimo) {\n  // conte usando o padrão do N5\n}\n\nfunction taxaAprovacao(notas, minimo) {\n  // reutilize contarAprovados\n}", fn: "taxaAprovacao", difficulty: "dificil", xp: 420, skill: "combinar função auxiliar, contador, array e divisão",
                hints: ["Primeiro descubra quantas notas atingem o mínimo.", "Depois divida a quantidade aprovada pelo total de notas e multiplique por 100.", "Faça contarAprovados retornar a quantidade; em taxaAprovacao, trate notas.length === 0 e depois use aprovados / notas.length * 100.", "function contarAprovados(notas, minimo) {\n  let quantidade = 0;\n\n  for (let i = 0; i < notas.length; i++) {\n    if (notas[i] >= minimo) quantidade++;\n  }\n\n  return quantidade;\n}\n\nfunction taxaAprovacao(notas, minimo) {\n  if (notas.length === 0) return 0;\n\n  const aprovados = contarAprovados(notas, minimo);\n  return aprovados / notas.length * 100;\n}"],
                tests: [{ args: [[10, 8], 7], exp: 100 }, { args: [[7, 6, 5, 9], 7], exp: 50 }, { args: [[4, 5], 7], exp: 0 }, { args: [[], 7], exp: 0 }]
            },
            {
                title: "BOSS · Finalizar compra", conceptIds: ["functions","parameters","localVariables","validation","functionComposition","multiStepLogic","arrayIteration","accumulators","comparisons","multiplication"], desc: "Some os valores com somarLista, aplique o percentual de desconto com aplicarDesconto e adicione o frete apenas se o total após desconto ficar abaixo de 200. Retorne 0 para lista vazia ou desconto fora de 0 a 50.", sig: "function finalizarCompra(valores, desconto, frete) { ... }", starter: "function somarLista(valores) {\n  // some a lista\n}\n\nfunction aplicarDesconto(valor, percentual) {\n  // aplique o desconto\n}\n\nfunction finalizarCompra(valores, desconto, frete) {\n  // valide e combine as funções auxiliares\n}", fn: "finalizarCompra", difficulty: "boss", xp: 550, skill: "combinar funções auxiliares, validação, array e regras de negócio em etapas",
                hints: ["Quebre o problema em três etapas: validar, calcular subtotal e calcular o total final.", "Use somarLista para obter o subtotal e aplicarDesconto para gerar o valor após desconto. Depois decida sobre o frete.", "Retorne 0 se valores estiver vazio ou desconto < 0 ou desconto > 50; calcule subtotal; aplique desconto; se o resultado for menor que 200, some frete.", "function somarLista(valores) {\n  let total = 0;\n\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n\n  return total;\n}\n\nfunction aplicarDesconto(valor, percentual) {\n  return valor * (1 - percentual / 100);\n}\n\nfunction finalizarCompra(valores, desconto, frete) {\n  if (valores.length === 0 || desconto < 0 || desconto > 50) return 0;\n\n  const subtotal = somarLista(valores);\n  const totalComDesconto = aplicarDesconto(subtotal, desconto);\n\n  if (totalComDesconto < 200) {\n    return totalComDesconto + frete;\n  }\n\n  return totalComDesconto;\n}"],
                tests: [{ args: [[], 10, 20], exp: 0 }, { args: [[100, 50], 10, 20], exp: 155 }, { args: [[100, 50, 50], 10, 20], exp: 200 }, { args: [[250], 0, 20], exp: 250 }, { args: [[100, 100], 51, 20], exp: 0 }, { args: [[200], 10, 50], exp: 230 }]
            }
        ]
    },
    { name: "Objetos", tag: "N7", exercises: null, count: 10, topics: "acessar, alterar, adicionar, remover, validar, calcular dados, lista de jogadores, produtos, usuários, inventário" },
    { name: "Lógica Avançada", tag: "N8", exercises: null, count: 10, topics: "segundo maior, frequência, agrupamento, números repetidos, interseção, diferença, soma alvo, sequência, estatísticas, desafios combinados" },
    { name: "Algoritmos", tag: "N9", exercises: null, count: 10, topics: "busca linear, busca binária, ordenação manual, maior sequência, contagem, frequência, mínimo/máximo, comparação, algoritmo combinado, otimização" },
    { name: "Boss Final", tag: "N10", exercises: null, count: 5, topics: "inventário, ranking, sistema bancário, sistema de cadastro, mini jogo" }
];
