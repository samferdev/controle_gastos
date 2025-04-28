// Funções da Home
export function initHome() {
  const saldoElement = document.getElementById('saldo');
  const formTransacao = document.getElementById('form-transacao');
  const rendaAtualInput = document.getElementById('renda-atual');

  // Carregar dados do localStorage
  let transacoes = [];
  let rendaAtual = 0;

  try {
    transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  } catch (e) {
    console.error('Error parsing transacoes from localStorage:', e);
  }

  try {
    rendaAtual = parseFloat(localStorage.getItem('rendaAtual')) || 0;
  } catch (e) {
    console.error('Error parsing rendaAtual from localStorage:', e);
  }

  // Atualizar saldo inicial
  updateSaldo();

  // Event listeners
  if (rendaAtualInput) {
    rendaAtualInput.addEventListener('change', (e) => {
      rendaAtual = parseFloat(e.target.value) || 0;
      localStorage.setItem('rendaAtual', rendaAtual);
      updateSaldo();
    });
  }

  if (formTransacao) {
    formTransacao.onsubmit = (e) => {
      e.preventDefault();
      const descricao = document.getElementById('descricao').value;
      const valor = parseFloat(document.getElementById('valor').value);
      const tipo = document.getElementById('tipo').value;
      const transacao = {
        id: Date.now(),
        descricao,
        valor,
        tipo,
        data: new Date().toLocaleDateString()
      };
      transacoes.push(transacao);
      localStorage.setItem('transacoes', JSON.stringify(transacoes));
      updateSaldo();
      formTransacao.reset();
    };
  }

  function updateSaldo() {
    if (!saldoElement) return;

    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalRenda = transacoes
      .filter(t => t.tipo === 'renda')
      .reduce((sum, t) => sum + t.valor, 0);

    const saldo = rendaAtual + totalRenda - totalDespesas;
    saldoElement.textContent = `R$ ${saldo.toFixed(2)}`;
  }
} 