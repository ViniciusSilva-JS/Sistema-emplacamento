function calcular() {
  // Pega os campos principais do formulário.
  const modeloSelect = document.getElementById("modelo");
  const mesSelect = document.getElementById("mes");
  const pagamentoSelect = document.getElementById("pagamento");
  const pagamentoIpvaSelect = document.getElementById("pagamentoIpva");

  // Guarda os valores escolhidos pelo usuário.
  const modelo = modeloSelect.value;
  const mes = Number(mesSelect.value);
  const tipoPagamento = pagamentoSelect.value;
  const tipoPagamentoIpva = pagamentoIpvaSelect.value;
  const nomeModelo = modeloSelect.options[modeloSelect.selectedIndex].text;
  const nomeMes = mesSelect.options[mesSelect.selectedIndex].text;
  const nomePagamento =
    pagamentoSelect.options[pagamentoSelect.selectedIndex].text;
  const nomePagamentoIpva =
    pagamentoIpvaSelect.options[pagamentoIpvaSelect.selectedIndex].text;

  // Cada checkbox define se a taxa entra ou não na simulação.
  const adicionarIpva = document.getElementById("ipva").checked;
  const adicionarPlaca = document.getElementById("placa").checked;
  const adicionarDespachante = document.getElementById("despachante").checked;
  const adicionarDetran = document.getElementById("detran").checked;
  const adicionarLicenciamento =
    document.getElementById("licenciamento").checked;

  // Tabela de preços e alíquotas usadas no cálculo.
  const motos = {
    150: { valor: 16500, aliquota: 0.02 },
    160: { valor: 19500, aliquota: 0.02 },
    200: { valor: 22500, aliquota: 0.02 },
    250: { valor: 23400, aliquota: 0.03 },
    400: { valor: 26990, aliquota: 0.03 },
    "400ns": { valor: 26990, aliquota: 0.03 },
  };

  const moto = motos[modelo];

  if (!moto) {
    alert("Modelo inválido.");
    return;
  }

  // Calcula o IPVA proporcional contando o mês escolhido até dezembro.
  const ipvaTotal = moto.valor * moto.aliquota;
  const valorMensal = ipvaTotal / 12;
  const mesesProporcionais = 12 - mes + 1;
  const parcelasIpva = 7;
  let ipvaProporcional = valorMensal * mesesProporcionais;

  // O desconto depende do pagamento do IPVA, nao da forma de compra da moto.
  const ipvaComDesconto = adicionarIpva && tipoPagamentoIpva === "avista";

  if (ipvaComDesconto) {
    ipvaProporcional *= 0.95;
  }

  // Se o usuário desligar o IPVA, ele não entra no total.
  if (!adicionarIpva) {
    ipvaProporcional = 0;
  }

  // Valores fixos das taxas opcionais.
  const primeiraCota =
    adicionarIpva && tipoPagamentoIpva === "parcelado"
      ? ipvaProporcional / parcelasIpva
      : 0;
  const valorPlaca = adicionarPlaca ? 190 : 0;
  const valorDespachante = adicionarDespachante ? 200 : 0;
  const valorDetran = adicionarDetran ? 118.42 : 0;
  const valorLicenciamento = adicionarLicenciamento
    ? tipoPagamento === "avista"
      ? 100
      : 154
    : 0;

  const total =
    ipvaProporcional +
    valorPlaca +
    valorDespachante +
    valorDetran +
    valorLicenciamento;

  // Monta o painel de resultado com os valores calculados.
  const appShell = document.querySelector(".app-shell");
  const resultado = document.getElementById("resultado");
  appShell.classList.remove("is-centered");
  appShell.classList.add("has-result");
  resultado.className = "result-panel updated";
  resultado.innerHTML = `
    <section class="result-card">
      <div class="result-header">
        <div class="result-icon">&#9635;</div>
        <div>
          <h2 class="result-title">Resumo da simulação</h2>
          <p class="result-subtitle">${nomePagamento} &bull; IPVA ${limparIcone(nomePagamentoIpva)} &bull; ${limparIcone(nomeModelo)} &bull; ${limparIcone(nomeMes)}</p>
        </div>
      </div>

      <div class="result-list">
        <div class="result-line">
          <span>IPVA proporcional ${ipvaComDesconto ? "com 5% desc." : ""}</span>
          ${valorOuNaoIncluso(adicionarIpva, ipvaProporcional)}
        </div>
        <div class="result-line">
          <span>Placa</span>
          ${valorOuNaoIncluso(adicionarPlaca, valorPlaca)}
        </div>
        <div class="result-line">
          <span>Despachante</span>
          ${valorOuNaoIncluso(adicionarDespachante, valorDespachante)}
        </div>
        <div class="result-line">
          <span>Taxa do DETRAN</span>
          ${valorOuNaoIncluso(adicionarDetran, valorDetran)}
        </div>
        <div class="result-line">
          <span>Licenciamento ${tipoPagamento === "avista" ? "(à vista)" : "(financiado)"}</span>
          ${valorOuNaoIncluso(adicionarLicenciamento, valorLicenciamento)}
        </div>
      </div>

      <div class="total-row">
        <div>
          <div class="total-label">Valor total</div>
          <p class="total-note">Somente os valores selecionados</p>
        </div>
        <div class="total-value">${formatar(total)}</div>
      </div>
    </section>

    <section class="quota-card">
      <div>
        <strong>${!adicionarIpva ? "IPVA não incluso" : tipoPagamentoIpva === "parcelado" ? `Primeira cota (1 de ${parcelasIpva})` : "IPVA pago completo"}</strong>
        <small>${adicionarIpva ? tipoPagamentoIpva === "parcelado" ? `IPVA dividido em ${parcelasIpva}x` : "Pagamento completo com 5% de desconto" : "IPVA não incluso"}</small>
      </div>
      <div class="quota-value">${formatar(primeiraCota)}</div>
      <div class="quota-icon">&#9633;</div>
    </section>

    <section class="info-card">
      <div class="info-title">
        <span class="info-icon">&#9432;</span>
        <span>Como funciona o cálculo?</span>
      </div>
      <p>
        O IPVA é opcional. Quando incluso, o sistema calcula o valor
        proporcional contando o mês escolhido até dezembro. Por exemplo:
        emplacando em maio, conta de maio a dezembro, totalizando 8 meses. O
        desconto de 5% entra quando o IPVA é pago completo.
      </p>
    </section>

    <button type="button" class="reset-button" onclick="novaSimulacao()">
      &#8635; Nova simulação
    </button>
  `;

  setTimeout(() => {
    resultado.classList.remove("updated");
  }, 500);
}

// Formata qualquer número no padrão de moeda brasileira.
function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Mostra o valor quando a taxa foi incluída ou "Não incluso" quando foi desligada.
function valorOuNaoIncluso(incluir, valor) {
  if (!incluir) {
    return '<span class="not-included">Não incluso</span>';
  }

  return `<span class="result-value">${formatar(valor)}</span>`;
}

// Remove emojis/símbolos para deixar o resumo textual mais limpo.
function limparIcone(texto) {
  return texto.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
}

// Volta todos os campos para o estado inicial da simulação.
function novaSimulacao() {
  document.getElementById("pagamento").value = "avista";
  document.getElementById("pagamentoIpva").value = "avista";
  document.getElementById("modelo").value = "150";
  document.getElementById("mes").value = "1";
  document.getElementById("ipva").checked = true;
  document.getElementById("placa").checked = false;
  document.getElementById("despachante").checked = false;
  document.getElementById("detran").checked = false;
  document.getElementById("licenciamento").checked = false;

  document.getElementById("resultado").className = "result-panel is-empty";
  document.querySelector(".app-shell").className = "app-shell is-centered";
  document.getElementById("resultado").innerHTML = `
    <section class="empty-card">
      <div class="empty-icon">&#9432;</div>
      <h2>Resumo da simulação</h2>
      <p>
        Escolha a forma de pagamento, o modelo, o mês do emplacamento e os
        itens que deseja incluir. Depois clique em Calcular.
      </p>
    </section>
  `;
}
