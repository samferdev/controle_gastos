// Adicionar a função ao objeto window para acesso global
declare global {
  interface Window {
    simularPlanejamento: (id: number) => void;
  }
}

type Planejamento = {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  parcelas?: number; // Número de parcelas opcional
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
  const parcelasInput = document.getElementById('parcelas-planejado') as HTMLInputElement | null;

  const descricao = descricaoInput?.value.trim() ?? '';
  const valor = parseFloat(valorInput?.value ?? '');
  const parcelas = parseInt(parcelasInput?.value ?? '1');

  if (!descricao || isNaN(valor) || isNaN(parcelas) || parcelas < 1) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const planejamento: Planejamento = {
    id: Date.now(),
    descricao,
    valor,
    parcelas,
    data: new Date().toLocaleDateString(),
  };

  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  planejamentos.push(planejamento);
  localStorage.setItem('planejamentos', JSON.stringify(planejamentos));

  updateListaPlanejados();
  updateResumo();
  (event.target as HTMLFormElement).reset();
  parcelasInput!.value = '1'; // Reset parcelas to 1
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
        <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.parcelas || 1}x</div>
        <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.data}</div>
        <div style="display: flex; gap: 8px;">
          <button 
            onclick="window.simularPlanejamento(${planejamento.id})" 
            style="background-color: #006400; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
            Simular
          </button>
          <button 
            data-id="${planejamento.id}" 
            style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
            X
          </button>
        </div>
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

export function simularPlanejamento(id: number) {
  const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
  const planejamento = planejamentos.find((p) => p.id === id);

  if (!planejamento) {
    alert('Planejamento não encontrado!');
    return;
  }

  const parcelas = planejamento.parcelas || 1; // Se não tiver parcelas, considera 1
  const valorPorParcela = planejamento.valor / parcelas;

  // Criar um array com as datas e valores das parcelas
  const simulacao = Array.from({ length: parcelas }, (_, index) => {
    const data = new Date();
    data.setMonth(data.getMonth() + index); // Adiciona meses à data atual

    return {
      parcela: index + 1,
      data: data.toLocaleDateString(),
      valor: valorPorParcela
    };
  });

  // Mostrar a simulação em um modal
  mostrarSimulacao(simulacao, planejamento);
}

function mostrarSimulacao(simulacao: Array<{ parcela: number; data: string; valor: number }>, planejamento: Planejamento) {
  // Criar o modal
  const modal = document.createElement('div');
  modal.className = 'modal-simulacao';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #222;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000;
    min-width: 300px;
    max-width: 500px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  `;

  // Criar o conteúdo do modal
  const conteudo = `
    <h3 style="color: white; margin-bottom: 15px;">Simulação: ${planejamento.descricao}</h3>
    <div style="max-height: 300px; overflow-y: auto;">
      <table style="width: 100%; border-collapse: collapse; color: white;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Parcela</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Data</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #444;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${simulacao.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #333;">${item.parcela}/${simulacao.length}</td>
              <td style="padding: 8px; border-bottom: 1px solid #333;">${item.data}</td>
              <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">R$ ${item.valor.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">R$ ${planejamento.valor.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <button id="fechar-simulacao" style="
      background: #006400;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      margin-top: 15px;
      cursor: pointer;
      width: 100%;
    ">Fechar</button>
  `;

  modal.innerHTML = conteudo;

  // Adicionar overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 999;
  `;

  // Adicionar ao DOM
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Fechar modal
  const fecharModal = () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  document.getElementById('fechar-simulacao')?.addEventListener('click', fecharModal);
  overlay.addEventListener('click', fecharModal);
}

// Atribuir a função ao objeto window
window.simularPlanejamento = simularPlanejamento;

