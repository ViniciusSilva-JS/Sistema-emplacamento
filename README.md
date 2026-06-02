# Sistema de Emplacamento Bajaj

Este projeto é uma página web simples para simular custos de emplacamento de motos Bajaj. O usuário escolhe forma de pagamento, modelo da moto, mês do emplacamento e quais taxas deseja incluir. Depois, o sistema calcula o valor total e mostra um resumo detalhado.

## Arquivos do projeto

- `CalculodoEmplacamento.html`: monta a estrutura da tela, os campos do formulário e o painel de resultado.
- `a3.css`: define o visual do sistema, incluindo cores, layout, botões, cards e responsividade.
- `a3.js`: contém toda a lógica de cálculo, formatação dos valores e atualização do resultado na tela.

## Como usar

1. Abra o arquivo `CalculodoEmplacamento.html` no navegador.
2. Escolha a forma de pagamento: à vista ou financiado.
3. Escolha o modelo da moto.
4. Escolha o mês do emplacamento.
5. Marque quais custos entram na simulação: IPVA, placa, despachante, taxa do DETRAN e licenciamento.
6. Clique em `Calcular`.
7. Veja o resumo da simulação no painel da direita.

## Regras de cálculo

O sistema usa uma tabela interna de modelos no arquivo `a3.js`. Cada moto tem um valor base e uma alíquota de IPVA:

- Pulsar 150: R$ 16.300,00, alíquota de 2%.
- Dominar 160 NS: R$ 19.150,00, alíquota de 2%.
- Dominar 200 NS: R$ 21.900,00, alíquota de 2%.
- Dominar 250: R$ 23.400,00, alíquota de 3%.
- Dominar 400: R$ 26.990,00, alíquota de 3%.
- Dominar NS400: R$ 26.990,00, alíquota de 3%.

O IPVA total é calculado assim:

```text
valor da moto x alíquota
```

Depois, o sistema calcula o IPVA proporcional:

```text
IPVA total / 12 x meses restantes
```

Os meses proporcionais são contados incluindo o mês escolhido até dezembro. Por exemplo: se o usuário escolher maio, o sistema considera maio, junho, julho, agosto, setembro, outubro, novembro e dezembro, totalizando 8 meses.

Mesmo que o IPVA seja proporcional ao mês escolhido, o valor proporcional continua sendo dividido em 7 parcelas no painel de primeira cota.

Se a forma de pagamento for à vista, o IPVA recebe 5% de desconto.

## Taxas opcionais

O usuário pode ligar ou desligar cada taxa:

- IPVA: calculado proporcionalmente.
- Placa: R$ 190,00.
- Despachante: R$ 200,00.
- Taxa do DETRAN: R$ 118,42.
- Licenciamento à vista: R$ 100,00.
- Licenciamento financiado: R$ 154,00.

Quando uma taxa está desligada, o resumo mostra `Não incluso`.

## Resultado

O painel de resultado mostra:

- Resumo da simulação.
- IPVA proporcional.
- Taxas incluídas ou não incluídas.
- Valor total.
- Primeira cota do IPVA.
- Explicação do cálculo.
- Botão para iniciar uma nova simulação.

## Responsividade

No computador, o formulário fica à esquerda e o resultado à direita. Em telas menores, como celulares, o resultado aparece abaixo do formulário.

## Principais funções do JavaScript

- `calcular()`: lê os dados escolhidos pelo usuário, calcula os valores e mostra o resultado.
- `formatar(valor)`: transforma números em moeda brasileira.
- `valorOuNaoIncluso(incluir, valor)`: decide se mostra o valor formatado ou o texto `Não incluso`.
- `limparIcone(texto)`: remove símbolos dos nomes usados no resumo.
- `novaSimulacao()`: limpa os campos e volta o painel de resultado para o estado inicial.

## Fluxograma do funcionamento

O sistema segue a estrutura basica de **entrada de dados**, **processamento** e **saida de informacoes**.

```text
┌──────────────────────────────┐
│            INICIO            │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│       ENTRADA DE DADOS       │
├──────────────────────────────┤
│ Usuario seleciona:           │
│ - forma de pagamento         │
│ - modelo da moto             │
│ - mes do emplacamento        │
│ - taxas que deseja incluir   │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│       CLIQUE EM CALCULAR     │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│         PROCESSAMENTO        │
├──────────────────────────────┤
│ O JavaScript executa:        │
│ 1. Le os dados do formulario │
│ 2. Busca o valor da moto     │
│ 3. Calcula o IPVA total      │
│ 4. Calcula o IPVA proporcional│
│ 5. Aplica desconto se for    │
│    pagamento a vista         │
│ 6. Soma as taxas marcadas    │
│ 7. Calcula o valor total     │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│      SAIDA DE INFORMACOES    │
├──────────────────────────────┤
│ O sistema mostra na tela:    │
│ - resumo da simulacao        │
│ - IPVA proporcional          │
│ - taxas incluidas ou nao     │
│ - primeira cota do IPVA      │
│ - valor total da simulacao   │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│             FIM              │
└──────────────────────────────┘
```

### Resumo em etapas

| Etapa         | O que acontece                                                  | Arquivo principal            |
| ------------- | --------------------------------------------------------------- | ---------------------------- |
| Entrada       | O usuario escolhe os dados no formulario.                       | `CalculodoEmplacamento.html` |
| Processamento | A funcao `calcular()` le os dados, calcula IPVA, taxas e total. | `a3.js`                      |
| Saida         | O painel de resultado e atualizado com os valores calculados.   | `a3.js` e `a3.css`           |

### Fluxograma em ASCII

Esta versao usa apenas caracteres simples para evitar problemas de acentuacao ou codificacao.

```text
+------------------------------+
|            INICIO            |
+--------------+---------------+
               |
               v
+------------------------------+
|       ENTRADA DE DADOS       |
+------------------------------+
| Usuario escolhe:             |
| - forma de pagamento         |
| - modelo da moto             |
| - mes do emplacamento        |
| - taxas opcionais            |
+--------------+---------------+
               |
               v
+------------------------------+
|       CLIQUE EM CALCULAR     |
+--------------+---------------+
               |
               v
+------------------------------+
|         PROCESSAMENTO        |
+------------------------------+
| JavaScript executa:          |
| - le os campos selecionados  |
| - identifica a moto          |
| - calcula o IPVA total       |
| - calcula o IPVA proporcional|
| - aplica desconto a vista    |
| - soma as taxas marcadas     |
| - calcula o total final      |
+--------------+---------------+
               |
               v
+------------------------------+
|      SAIDA DE INFORMACOES    |
+------------------------------+
| Sistema exibe:               |
| - resumo da simulacao        |
| - taxas incluidas            |
| - taxas nao incluidas        |
| - primeira cota do IPVA      |
| - valor total                |
+--------------+---------------+
               |
               v
+------------------------------+
|              FIM             |
+------------------------------+
```
