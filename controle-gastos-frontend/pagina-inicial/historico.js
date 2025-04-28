// Funções do Histórico
export function initHistorico() {
  const listaTransacoes = document.getElementById('lista-transacoes');
  let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

  function updateListaTransacoes() {
    listaTransacoes.innerHTML = '';
    if (transacoes.length === 0) {
      listaTransacoes.innerHTML = '<li>Nenhuma transação encontrada.</li>';
      return;
    }
    transacoes.forEach(transacao => {
      const li = document.createElement('li');
      li.className = transacao.tipo;
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
          <div style="flex: 2; margin-right: 15px;">${transacao.descricao}</div>
          <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${Number(transacao.valor).toFixed(2)}</div>
          <div style="flex: 1; text-align: center; margin-right: 15px;">${transacao.data || ''}</div>
          <button class="remover-transacao" data-id="${transacao.id}" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
        </div>
      `;
      listaTransacoes.appendChild(li);
    });
    listaTransacoes.querySelectorAll('.remover-transacao').forEach(btn => {
      btn.onclick = (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        transacoes = transacoes.filter(t => t.id !== id);
        localStorage.setItem('transacoes', JSON.stringify(transacoes));
        updateListaTransacoes();
      };
    });
  }

  updateListaTransacoes();
}