type Gasto = {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  parcelas: number;
};

export function initGastosPrevistos() {
  const formGastosPrevistos = document.getElementById('form-gasto-previstos') as HTMLFormElement | null;

  if (formGastosPrevistos) {
    formGastosPrevistos.addEventListener('submit', handleGastoPrevisto);
  }

  renderizarGastos();
  updateResumo();
}

function handleGastoPrevisto(event: Event) {
  event.preventDefault();

  const descricaoInput = document.getElementById('descricao-gasto-previstos') as HTMLInputElement | null;
  const valorInput = document.getElementById('valor-gasto-previstos') as HTMLInputElement | null;
  const parcelasInput = document.getElementById('parcelas') as HTMLInputElement | null;

  if (!descricaoInput || !valorInput || !parcelasInput) {
    console.error('Campos do formulário não encontrados');
    return;
  }

  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const parcelas = parseInt(parcelasInput.value);

  // Validação específica para cada campo
  if (!descricao || descricao.length < 3) {
    alert('A descrição deve ter pelo menos 3 caracteres.');
    return;
  }

  if (isNaN(valor) || valor <= 0) {
    alert('O valor deve ser um número maior que zero.');
    return;
  }

  if (isNaN(parcelas) || parcelas < 1) {
    alert('O número de parcelas deve ser pelo menos 1.');
    return;
  }

  const gasto: Gasto = {
    id: Date.now(),
    descricao,
    valor,
    data: new Date().toLocaleDateString(),
    parcelas,
  };

  try {
    const gastos: Gasto[] = JSON.parse(localStorage.getItem('gastos') || '[]');
    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    renderizarGastos();
    updateResumo();
    (event.target as HTMLFormElement).reset();
  } catch (error) {
    console.error('Erro ao salvar gasto:', error);
    alert('Erro ao salvar o gasto. Por favor, tente novamente.');
  }
}

function renderizarGastos() {
  const listaGastos = document.querySelectorAll<HTMLUListElement>('#lista-gastos-previstos');
  const gastos: Gasto[] = JSON.parse(localStorage.getItem('gastos') || '[]');

  listaGastos.forEach(lista => {
    lista.innerHTML = '';
    gastos.forEach(gasto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
          <div style="flex: 2; margin-right: 15px;">${gasto.descricao}</div>
          <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${gasto.valor.toFixed(2)}</div>
          <div style="flex: 1; text-align: center; margin-right: 15px;">${gasto.data}</div>
          <button class="remover-gasto-btn" data-id="${gasto.id}" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
          <div style="flex: 1; text-align: center; margin-right: 15px;">${gasto.parcelas}</div>
        </div>
      `;
      lista.appendChild(li);
    });
  });

  // Add event listeners for remove buttons
  document.querySelectorAll<HTMLButtonElement>('.remover-gasto-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      removerGastos(id);
    });
  });
}

function removerGastos(id: number) {
  let gastos: Gasto[];
  try {
    const data = localStorage.getItem('gastos');
    gastos = data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erro ao carregar item (gastos) do localstorage: ", e);
    gastos = [];
  }
  const novosGastos = gastos.filter((p: Gasto) => p.id !== id);
  localStorage.setItem('gastos', JSON.stringify(novosGastos));
  renderizarGastos();
  updateResumo();
}

// Dummy implementation for updateResumo (implement as needed)
function updateResumo() {
  // Atualize o resumo dos gastos previstos aqui, se necessário
}
// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initGastosPrevistos();
});


