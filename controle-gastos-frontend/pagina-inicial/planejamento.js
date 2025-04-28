// Funções do Planejamento
export const planejamentoTemplate = `
  <section class="planejamento">
    <h2>Planejamentos Futuros</h2>
    <div class="novo-planejamento">
      <form id="form-planejado">
        <input type="text" id="descricao-planejado" placeholder="Meta ou fatura" required />
        <input type="number" id="valor-planejado" placeholder="Valor futuro" required />
        <button type="submit">Adicionar</button>
      </form>
    </div>
    <div class="filtros-planejamento">
      <input type="date" id="filtro-data-inicio" />
      <input type="date" id="filtro-data-fim" />
    </div>
    <ul id="lista-planejados"></ul>
    <div class="resumo-planejamento">
      <h3>Resumo</h3>
      <p>Total Planejado: <span id="total-planejado">R$ 0,00</span></p>
      <p>Saldo Atual: <span id="saldo-atual">R$ 0,00</span></p>
      <p>Diferença: <span id="diferenca">R$ 0,00</span></p>
    </div>
  </section>
`;

export function initializePlanejamento() {
  const formPlanejado = document.getElementById('form-planejado');
  const filtroDataInicio = document.getElementById('filtro-data-inicio');
  const filtroDataFim = document.getElementById('filtro-data-fim');

  if (formPlanejado) {
    formPlanejado.addEventListener('submit', handlePlanejadoSubmit);
  }

  if (filtroDataInicio) {
    filtroDataInicio.addEventListener('change', updateListaPlanejados);
  }

  if (filtroDataFim) {
    filtroDataFim.addEventListener('change', updateListaPlanejados);
  }

  updateListaPlanejados();
  updateResumo();
}

function handlePlanejadoSubmit(event) {
  event.preventDefault();

  const descricao = document.getElementById('descricao-planejado').value.trim();
  const valor = parseFloat(document.getElementById('valor-planejado').value);

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const planejamento = {
    id: Date.now(),
    descricao,
    valor,
    data: new Date().toLocaleDateString(),
  };

  const planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
  planejamentos.push(planejamento);
  localStorage.setItem('planejamentos', JSON.stringify(planejamentos));

  // Atualizar a lista em todas as seções
  const listasPlanejados = document.querySelectorAll('#lista-planejados');
  listasPlanejados.forEach(lista => {
    if (lista) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
          <div style="flex: 2; margin-right: 15px;">${planejamento.descricao}</div>
          <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${planejamento.valor.toFixed(2)}</div>
          <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.data}</div>
          <button onclick="removerPlanejamento(${planejamento.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
        </div>
      `;
      lista.appendChild(li);
    }
  });

  updateResumo();
  event.target.reset();
}

function updateListaPlanejados() {
  const listaPlanejados = document.getElementById('lista-planejados');
  if (!listaPlanejados) return;

  const planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
  const filtroDataInicio = document.getElementById('filtro-data-inicio')?.value;
  const filtroDataFim = document.getElementById('filtro-data-fim')?.value;

  const planejamentosFiltrados = planejamentos.filter((planejamento) => {
    const dataPlanejamento = new Date(planejamento.data.split('/').reverse().join('-'));

    if (filtroDataInicio && dataPlanejamento < new Date(filtroDataInicio)) {
      return false;
    }

    if (filtroDataFim && dataPlanejamento > new Date(filtroDataFim)) {
      return false;
    }

    return true;
  });

  listaPlanejados.innerHTML = '';
  planejamentosFiltrados.forEach((planejamento) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
        <div style="flex: 2; margin-right: 15px;">${planejamento.descricao}</div>
        <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${planejamento.valor.toFixed(2)}</div>
        <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.data}</div>
        <button onclick="removerPlanejamento(${planejamento.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
      </div>
    `;
    listaPlanejados.appendChild(li);
  });
}

function updateResumo() {
  const totalPlanejadoElement = document.getElementById('total-planejado');
  const saldoAtualElement = document.getElementById('saldo-atual');
  const diferencaElement = document.getElementById('diferenca');

  if (!totalPlanejadoElement || !saldoAtualElement || !diferencaElement) return;

  const planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  const rendaAtual = parseFloat(localStorage.getItem('rendaAtual')) || 0;

  const totalPlanejado = planejamentos.reduce((sum, p) => sum + p.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalRenda = transacoes
    .filter((t) => t.tipo === 'renda')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoAtual = rendaAtual + totalRenda - totalDespesas;
  const diferenca = saldoAtual - totalPlanejado;

  totalPlanejadoElement.textContent = `R$ ${totalPlanejado.toFixed(2)}`;
  saldoAtualElement.textContent = `R$ ${saldoAtual.toFixed(2)}`;
  diferencaElement.textContent = `R$ ${diferenca.toFixed(2)}`;
  diferencaElement.className = diferenca >= 0 ? 'positivo' : 'negativo';
}

function removerPlanejamento(id) {
  const planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
  const novosPlanejamentos = planejamentos.filter((p) => p.id !== id);
  localStorage.setItem('planejamentos', JSON.stringify(novosPlanejamentos));
  
  // Atualizar todas as listas de planejamentos na página
  const listasPlanejados = document.querySelectorAll('#lista-planejados');
  listasPlanejados.forEach(lista => {
    if (lista) {
      const item = lista.querySelector(`button[onclick="removerPlanejamento(${id})"]`)?.closest('li');
      if (item) {
        item.remove();
      }
    }
  });
  
  updateResumo();
}

// Tornar a função acessível globalmente
window.removerPlanejamento = removerPlanejamento;

export { removerPlanejamento };

export function initPlanejamento() {
  initializePlanejamento();
}

// Removendo o event listener duplicado
// const formPlanejado = document.getElementById('form-planejado');
// const listaPlanejados = document.getElementById('lista-planejados');

// formPlanejado.addEventListener('submit', (event) => {
//   event.preventDefault(); // Prevent the default form submission behavior

//   const descricao = document.getElementById('descricao-planejado').value;
//   const valor = document.getElementById('valor-planejado').value;

//   if (descricao && valor) {
//     const li = document.createElement('li');
//     li.textContent = `${descricao}: R$ ${parseFloat(valor).toFixed(2)}`;
//     listaPlanejados.appendChild(li);

//     // Clear the form inputs
//     document.getElementById('descricao-planejado').value = '';
//     document.getElementById('valor-planejado').value = '';
//   }
// });   