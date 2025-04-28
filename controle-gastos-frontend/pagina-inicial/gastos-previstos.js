// gastos-previstos.js

document.addEventListener('DOMContentLoaded', () => {
    const formGastosPrevistos = document.getElementById('form-gastos-previstos');
    const listaGastosPrevistos = document.getElementById('lista-gastos-previstos');
    const gastosPrevistos = [];

    if (formGastosPrevistos) {
        formGastosPrevistos.addEventListener('submit', (e) => {
            e.preventDefault();

            const descricao = document.getElementById('descricao-gastos-previstos').value.trim();
            const valor = parseFloat(document.getElementById('valor-gastos-previstos').value);

            if (!descricao || isNaN(valor) || valor <= 0) {
                alert('Preencha todos os campos corretamente.');
                return;
            }

            // Adicionar o gasto à lista
            gastosPrevistos.push({ descricao, valor });

            // Atualizar a exibição
            atualizarListaGastos(listaGastosPrevistos, gastosPrevistos);

            // Limpar o formulário
            formGastosPrevistos.reset();
        });
    }
});

function atualizarListaGastos(lista, gastos) {
    lista.innerHTML = ''; // Limpar a lista
    gastos.forEach((gasto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${gasto.descricao} - R$ ${gasto.valor.toFixed(2)}</span>
            <button onclick="removerGasto(${index})">Remover</button>
        `;
        lista.appendChild(li);
    });
}

function removerGasto(index) {
    const listaGastosPrevistos = document.getElementById('lista-gastos-previstos');
    gastosPrevistos.splice(index, 1);
    atualizarListaGastos(listaGastosPrevistos, gastosPrevistos);
}