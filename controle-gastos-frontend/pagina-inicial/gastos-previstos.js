export function initGastosPrevistos() {
  const listGastosPrevistos = document.getElementById('lista-gastos-previstos');
  const formGastosPrevistos = document.getElementById('form-gasto-previstos');

  if (formGastosPrevistos) {
    formGastosPrevistos.addEventListener('submit', handleGastoPrevisto)
  }

  /*if () {

  }

  if () {

  }*/

  removerGastos();
  renderizarGastos();
}


/*document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('side-gastos-previstos').addEventListener('click', () => {
    const container = document.getElementById('app-container');
    const gastosPrevistosTemplate = document.getElementById('gastos-previstos-template');

    if (!gastosPrevistosTemplate || !container) {
      console.error('Template e container não encontrado')

      return
    }

    const clone = gastosPrevistosTemplate.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(clone);
    initGastosPrevistos();

  })
})*/


function handleGastoPrevisto(event) {
  event.preventDefault();

  const descricao = document.getElementById('descricao-gasto-previstos').value.trim();
  const valor = parseFloat(document.getElementById('valor-gasto-previstos').value);

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const gasto = {
    id: Date.now(),
    descricao,
    valor,
    data: new Date().toLocaleDateString(),
  };

  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  gastos.push(gasto);
  localStorage.setItem('gastos', JSON.stringify(gastos));

  // Atualizar a lista em todas as seções
  const listaGastos = document.querySelectorAll('#lista-gastos-previstos');
  listaGastos.forEach(lista => {
    if (lista) {
      const li = document.createElement('li');
      li.innerHTML = `
         <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
           <div style="flex: 2; margin-right: 15px;">${gasto.descricao}</div>
           <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${gasto.valor.toFixed(2)}</div>
           <div style="flex: 1; text-align: center; margin-right: 15px;">${gasto.data}</div>
           <button onclick="removerGastos(${gasto.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
         </div>
       `;
      lista.appendChild(li);
    }
  });

  updateResumo();
  event.target.reset();
}

function renderizarGastos() {
  const listaGastos = document.querySelectorAll('#lista-gastos-previstos');
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];

  listaGastos.forEach(lista => {
    lista.innerHTML = '';
    gastos.forEach(gasto => {
      const li = document.createElement('li');

      li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
        <div style="flex: 2; margin-right: 15px;">${gasto.descricao}</div>
        <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${gasto.valor.toFixed(2)}</div>
        <div style="flex: 1; text-align: center; margin-right: 15px;">${gasto.data}</div>
        <button onclick="removerGastos(${gasto.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
      </div>
   `;

      lista.appendChild(li);
    });
  });
}

function adicionarGasto(event) {
  const adicionarGastoBtn = document.getElementById('adicionar-gasto-btn')
  let gastos;

  try {
    const data = localStorage.setItem('gastos')
    gastos = data ? JSON.parse(data) : []
  } catch (e) {
    console.error("Erro ao carregar item (gastos) do localstorage: ", e)
    gastos = []
  }



}

function removerGastos(id) {
  let gastos;
  try {
    const data = localStorage.getItem('gastos')
    gastos = data ? JSON.parse(data) : []
  } catch (e) {
    console.error("Erro ao carregar item (gastos) do localstorage: ", e)
    gastos = []
  }
  const novosGastos = gastos.filter((p) => p.id !== id);
  localStorage.setItem('gastos', JSON.stringify(novosGastos));

  // Atualizar todas as listas de gastos na página
  const listaGastos = document.querySelectorAll('#lista-gastos-previstos');
  listaGastos.forEach(lista => {
    if (lista) {
      const item = lista.querySelector(`button[onclick="removerGastos(${id})"]`)?.closest('li');
      if (item) {
        item.remove();
      }
    }
  });
  window.removerGastos = removerGastos;
}
