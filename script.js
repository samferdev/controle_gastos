// DOM Elements
const formTransacao = document.getElementById('form-transacao');
const formPlanejado = document.getElementById('form-planejado');
const listaTransacoes = document.getElementById('lista-transacoes');
const listaPlanejados = document.getElementById('lista-planejados');
const saldoElement = document.getElementById('saldo');
const rendaAtualInput = document.getElementById('renda-atual');

// State
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
let planejamentos = JSON.parse(localStorage.getItem('planejamentos')) || [];
let rendaAtual = parseFloat(localStorage.getItem('rendaAtual')) || 0;

// Initialize
updateSaldo();
updateListaTransacoes();
updateListaPlanejados();
if (rendaAtual > 0) {
    rendaAtualInput.value = rendaAtual.toFixed(2);
}

// Event Listeners
formTransacao.addEventListener('submit', (e) => {
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
    saveTransacoes();
    updateSaldo();
    updateListaTransacoes();
    formTransacao.reset();
});

formPlanejado.addEventListener('submit', (e) => {
    e.preventDefault();
    const descricao = document.getElementById('descricao-planejado').value;
    const valor = parseFloat(document.getElementById('valor-planejado').value);
    
    const planejamento = {
        id: Date.now(),
        descricao,
        valor,
        data: new Date().toLocaleDateString()
    };
    
    planejamentos.push(planejamento);
    savePlanejamentos();
    updateListaPlanejados();
    formPlanejado.reset();
});

rendaAtualInput.addEventListener('change', (e) => {
    rendaAtual = parseFloat(e.target.value) || 0;
    localStorage.setItem('rendaAtual', rendaAtual);
    updateSaldo();
});

// Functions
function updateSaldo() {
    const totalDespesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((sum, t) => sum + t.valor, 0);
    
    const totalRenda = transacoes
        .filter(t => t.tipo === 'renda')
        .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = rendaAtual + totalRenda - totalDespesas;
    saldoElement.textContent = `R$ ${saldo.toFixed(2)}`;
}

function updateListaTransacoes() {
    listaTransacoes.innerHTML = '';
    transacoes.forEach(transacao => {
        const li = document.createElement('li');
        li.className = transacao.tipo;
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
                <div style="flex: 2; margin-right: 15px;">${transacao.descricao}</div>
                <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${transacao.valor.toFixed(2)}</div>
                <div style="flex: 1; text-align: center; margin-right: 15px;">${transacao.data}</div>
                <button onclick="removerTransacao(${transacao.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
            </div>
        `;
        listaTransacoes.appendChild(li);
    });
}

function updateListaPlanejados() {
    listaPlanejados.innerHTML = '';
    planejamentos.forEach(planejamento => {
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

function removerTransacao(id) {
    transacoes = transacoes.filter(t => t.id !== id);
    saveTransacoes();
    updateSaldo();
    updateListaTransacoes();
}

function removerPlanejamento(id) {
    planejamentos = planejamentos.filter(p => p.id !== id);
    savePlanejamentos();
    updateListaPlanejados();
}

function saveTransacoes() {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

function savePlanejamentos() {
    localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
}
