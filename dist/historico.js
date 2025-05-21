"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHistorico = initHistorico;
function initHistorico() {
    const listaTransacoes = document.getElementById('lista-transacoes');
    let transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');
    function formatarValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }
    function criarItemTransacao(transacao) {
        const li = document.createElement('li');
        li.className = transacao.tipo;
        li.innerHTML = `
      <div class="transacao-item">
        <div class="descricao">${transacao.descricao}</div>
        <div class="valor">${formatarValor(transacao.valor)}</div>
        <div class="data">${transacao.data || 'Sem data'}</div>
        <button class="remover-transacao" data-id="${transacao.id}" aria-label="Remover transação">X</button>
      </div>
    `;
        return li;
    }
    function updateListaTransacoes() {
        listaTransacoes.innerHTML = '';
        if (transacoes.length === 0) {
            listaTransacoes.innerHTML = '<li class="sem-transacoes">Nenhuma transação encontrada.</li>';
            return;
        }
        transacoes.forEach((transacao) => {
            const li = criarItemTransacao(transacao);
            listaTransacoes.appendChild(li);
        });
        document.querySelectorAll('.remover-transacao').forEach((btn) => {
            btn.onclick = (e) => {
                const id = Number(e.target.dataset.id);
                transacoes = transacoes.filter((t) => t.id !== id);
                localStorage.setItem('transacoes', JSON.stringify(transacoes));
                updateListaTransacoes();
            };
        });
    }
    updateListaTransacoes();
}
