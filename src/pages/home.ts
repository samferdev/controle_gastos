interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'renda' | 'despesa';
  data: string;
}

export function initHome() {
  const saldoElement = document.getElementById('saldo');
  const formTransacao = document.getElementById('form-transacao') as HTMLFormElement | null;
  const rendaAtualInput = document.getElementById('renda-atual') as HTMLInputElement | null;

  let transacoes: Transaction[] = [];
  let rendaAtual = 0;

  try {
    const stored = localStorage.getItem('transacoes');
    transacoes = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error parsing transacoes from localStorage:', e);
  }

  try {
    const renda = localStorage.getItem('rendaAtual');
    rendaAtual = renda ? parseFloat(renda) : 0;
  } catch (e) {
    console.error('Error parsing rendaAtual from localStorage:', e);
  }

  updateSaldo();

  if (rendaAtualInput) {
    rendaAtualInput.value = rendaAtual.toString();
    rendaAtualInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      rendaAtual = parseFloat(target.value) || 0;
      localStorage.setItem('rendaAtual', rendaAtual.toString());
      updateSaldo();
    });
  }

  if (formTransacao) {
    formTransacao.onsubmit = (e) => {
      e.preventDefault();
      const descricaoInput = document.getElementById('descricao') as HTMLInputElement | null;
      const valorInput = document.getElementById('valor') as HTMLInputElement | null;
      const tipoInput = document.getElementById('tipo') as HTMLSelectElement | null;

      if (!descricaoInput || !valorInput || !tipoInput) return;

      const descricao = descricaoInput.value;
      const valor = parseFloat(valorInput.value);
      const tipo = tipoInput.value as 'renda' | 'despesa';

      if (!descricao || isNaN(valor) || !tipo) return;

      const transacao: Transaction = {
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