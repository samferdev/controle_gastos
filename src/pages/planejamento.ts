type Planejamento = {
  id: number;
  descricao: string;
  valor: number;
  data: string;
};

type Transacao = {
  tipo: 'renda' | 'despesa';
  valor: number;
};

export function initializePlanejamento() {
  const formPlanejado = document.getElementById('form-planejado') as HTMLFormElement | null;
  const filtroDataInicio = document.getElementById('filtro-data-inicio') as HTMLInputElement | null;
  const filtroDataFim = document.getElementById('filtro-data-fim') as HTMLInputElement | null;
  const listaPlanejados = document.getElementById('lista-planejados') as HTMLUListElement | null;

  if (formPlanejado) {
    formPlanejado.addEventListener('submit', handlePlanejadoSubmit);
  }

  if (filtroDataInicio) {
    filtroDataInicio.addEventListener('change', updateListaPlanejados);
  }

  if (filtroDataFim) {
    filtroDataFim.addEventListener('change', updateListaPlanejados);
  }

  // Event delegation for remove buttons
  if (listaPlanejados) {
    listaPlanejados.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' && target.dataset.id) {
        removerPlanejamento(Number(target.dataset.id));
      }
    });
  }

  updateListaPlanejados();
  updateResumo();
}

function handlePlanejadoSubmit(event: Event) {
  event.preventDefault();

  const descricaoInput = document.getElementById('descricao-planejado') as HTMLInputElement | null;
  const valorInput = document.getElementById('valor-planejado') as HTMLInputElement | null;

  const descricao = descricaoInput?.value.trim() ?? '';
  const valor = parseFloat(valorInput?.value ?? '');

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const planejamento: Planejamento = {
    id: Date.now(),
    descricao,
    valor,
    data: new Date().toLocaleDateString(),
  };

  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  planejamentos.push(planejamento);
  localStorage.setItem('planejamentos', JSON.stringify(planejamentos));

  updateListaPlanejados();
  updateResumo();
  (event.target as HTMLFormElement).reset();
}

function updateListaPlanejados() {
  const listaPlanejados = document.getElementById('lista-planejados') as HTMLUListElement | null;
  if (!listaPlanejados) return;

  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  const filtroDataInicio = (document.getElementById('filtro-data-inicio') as HTMLInputElement | null)?.value;
  const filtroDataFim = (document.getElementById('filtro-data-fim') as HTMLInputElement | null)?.value;

  const planejamentosFiltrados = planejamentos.filter((planejamento) => {
    const [day, month, year] = planejamento.data.split('/');
    const dataPlanejamento = new Date(`${year}-${month}-${day}`);
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
        <button data-id="${planejamento.id}" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
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

  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  const transacoes: Transacao[] = JSON.parse(localStorage.getItem('transacoes') ?? '[]');
  const rendaAtual = parseFloat(localStorage.getItem('rendaAtual') ?? '0');

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

function removerPlanejamento(id: number) {
  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  const novosPlanejamentos = planejamentos.filter((p) => p.id !== id);
  localStorage.setItem('planejamentos', JSON.stringify(novosPlanejamentos));
  updateListaPlanejados();
  updateResumo();
}

export function initPlanejamento() {
  initializePlanejamento();
}

