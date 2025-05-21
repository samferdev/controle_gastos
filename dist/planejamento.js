"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePlanejamento = initializePlanejamento;
exports.initPlanejamento = initPlanejamento;
function initializePlanejamento() {
    const formPlanejado = document.getElementById('form-planejado');
    const filtroDataInicio = document.getElementById('filtro-data-inicio');
    const filtroDataFim = document.getElementById('filtro-data-fim');
    const listaPlanejados = document.getElementById('lista-planejados');
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
            const target = e.target;
            if (target.tagName === 'BUTTON' && target.dataset.id) {
                removerPlanejamento(Number(target.dataset.id));
            }
        });
    }
    updateListaPlanejados();
    updateResumo();
}
function handlePlanejadoSubmit(event) {
    var _a, _b, _c;
    event.preventDefault();
    const descricaoInput = document.getElementById('descricao-planejado');
    const valorInput = document.getElementById('valor-planejado');
    const descricao = (_a = descricaoInput === null || descricaoInput === void 0 ? void 0 : descricaoInput.value.trim()) !== null && _a !== void 0 ? _a : '';
    const valor = parseFloat((_b = valorInput === null || valorInput === void 0 ? void 0 : valorInput.value) !== null && _b !== void 0 ? _b : '');
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
    const planejamentos = JSON.parse((_c = localStorage.getItem('planejamentos')) !== null && _c !== void 0 ? _c : '[]');
    planejamentos.push(planejamento);
    localStorage.setItem('planejamentos', JSON.stringify(planejamentos));
    updateListaPlanejados();
    updateResumo();
    event.target.reset();
}
function updateListaPlanejados() {
    var _a, _b, _c;
    const listaPlanejados = document.getElementById('lista-planejados');
    if (!listaPlanejados)
        return;
    const planejamentos = JSON.parse((_a = localStorage.getItem('planejamentos')) !== null && _a !== void 0 ? _a : '[]');
    const filtroDataInicio = (_b = document.getElementById('filtro-data-inicio')) === null || _b === void 0 ? void 0 : _b.value;
    const filtroDataFim = (_c = document.getElementById('filtro-data-fim')) === null || _c === void 0 ? void 0 : _c.value;
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
    var _a, _b, _c;
    const totalPlanejadoElement = document.getElementById('total-planejado');
    const saldoAtualElement = document.getElementById('saldo-atual');
    const diferencaElement = document.getElementById('diferenca');
    if (!totalPlanejadoElement || !saldoAtualElement || !diferencaElement)
        return;
    const planejamentos = JSON.parse((_a = localStorage.getItem('planejamentos')) !== null && _a !== void 0 ? _a : '[]');
    const transacoes = JSON.parse((_b = localStorage.getItem('transacoes')) !== null && _b !== void 0 ? _b : '[]');
    const rendaAtual = parseFloat((_c = localStorage.getItem('rendaAtual')) !== null && _c !== void 0 ? _c : '0');
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
    var _a;
    const planejamentos = JSON.parse((_a = localStorage.getItem('planejamentos')) !== null && _a !== void 0 ? _a : '[]');
    const novosPlanejamentos = planejamentos.filter((p) => p.id !== id);
    localStorage.setItem('planejamentos', JSON.stringify(novosPlanejamentos));
    updateListaPlanejados();
    updateResumo();
}
function initPlanejamento() {
    initializePlanejamento();
}
