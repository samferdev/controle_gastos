// DOM Elements
const formTransacao = document.getElementById('form-transacao');
const listaTransacoes = document.getElementById('lista-transacoes');
const saldoElement = document.getElementById('saldo');
const rendaAtualInput = document.getElementById('renda-atual');

// State
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

// Initialize
updateSaldo();
updateListaTransacoes();
if (rendaAtual > 0) {
    rendaAtualInput.value = rendaAtual.toFixed(2);
}

// Event Listeners
if (formTransacao) {
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
}

if (rendaAtualInput) {
    rendaAtualInput.addEventListener('change', (e) => {
        rendaAtual = parseFloat(e.target.value) || 0;
        localStorage.setItem('rendaAtual', rendaAtual);
        updateSaldo();
    });
}

// Functions
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

function updateListaTransacoes() {
    if (!listaTransacoes) return;

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

function removerTransacao(id) {
    transacoes = transacoes.filter(t => t.id !== id);
    saveTransacoes();
    updateSaldo();
    updateListaTransacoes();
}

function saveTransacoes() {
    const nome = localStorage.getItem('nomeUsuario');
    if (!nome) {
        alert('Usuário não autenticado. Redirecionando para a página de login.');
        window.location.href = '../login/login.html';
    }
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}


// Make functions globally available
window.removerTransacao = removerTransacao;

document.addEventListener('DOMContentLoaded', () => {
    const nomeSpan = document.getElementById('nomeUsuario');
    if (nomeSpan) {
        const nome = localStorage.getItem('nomeUsuario');
        nomeSpan.textContent = nome || 'Usuário';
    }

    const nome = localStorage.getItem('nomeUsuario');
    if (!nome) {
        window.location.href = '../login/login.html';
    }

    const openBtn = document.getElementById('open-btn');
    if (openBtn) {
        openBtn.onclick = toggleSidebar;
    }

    // SPA Navigation
    const main = document.querySelector('main');
    const homeBtn = document.getElementById('side-home');
    const historicoBtn = document.getElementById('side-historico');
    const planejamentoBtn = document.getElementById('side-planejamento');

    if (homeBtn) {
        homeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            main.innerHTML = homeTemplate;
            const module = await import('./home.js');
            module.initHome();
        });
    }

    if (historicoBtn) {
        historicoBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            main.innerHTML = historicoTemplate;
            const module = await import('./historico.js');
            module.initHistorico();
        });
    }

    if (planejamentoBtn) {
        planejamentoBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            main.innerHTML = planejamentoTemplate;
            const module = await import('./planejamento.js');
            module.initPlanejamento();
        });
    }

    // Render home initially
    if (main) {
        main.innerHTML = homeTemplate;
        import('./home.js').then(module => module.initHome());
    }
});

function toggleSidebar() {
    const nav = document.querySelector('nav');
    const main = document.querySelector('main');
    const descriptions = document.querySelectorAll('.item-description');

    if (!nav || !main) return;

    nav.style.transition = 'width 0.3s ease';
    main.style.transition = 'margin-left 0.3s ease';

    descriptions.forEach(desc => {
        desc.style.transition = 'opacity 0.15s ease';
    });

    nav.classList.toggle('collapsed');

    if (nav.classList.contains('collapsed')) {
        descriptions.forEach(desc => {
            desc.style.opacity = '0';
        });

        setTimeout(() => {
            nav.style.width = '80px';
            main.style.marginLeft = '80px';
            descriptions.forEach(desc => {
                desc.style.display = 'none';
            });
        }, 150);
    } else {
        nav.style.width = '240px';
        main.style.marginLeft = '240px';

        setTimeout(() => {
            descriptions.forEach(desc => {
                desc.style.display = 'block';
                setTimeout(() => {
                    desc.style.opacity = '1';
                }, 50);
            });
        }, 150);
    }
}

// Templates
const homeTemplate = `
  <section class="saldo">
    <h2>Saldo Atual: <span id="saldo">R$ 0,00</span></h2>
  </section>
  <section class="transacao">
    <form id="form-transacao">
      <input type="text" id="descricao" placeholder="Descrição" required />
      <input type="number" id="valor" placeholder="Valor (ex: 100.00)" required />
      <select id="tipo">
        <option value="renda">Renda</option>
        <option value="despesa">Despesas</option>
      </select>
      <button type="submit">Adicionar</button>
    </form>
  </section>
  <section class="renda-atual">
    <h2>Entre com sua renda Atual</h2>
    <input type="text" id="renda-atual" placeholder="Valor (ex: 100.00)">
  </section>
`;

const historicoTemplate = `
  <section class="historico">
    <h2>Histórico</h2>
    <ul id="lista-transacoes"></ul>
  </section>
`;

const planejamentoTemplate = `
  <section class="planejamento">
    <h2>Planejamentos Futuros</h2>
    <div class="novo-planejamento">
      <form id="form-planejado">
        <input type="text" id="descricao-planejado" placeholder="Meta ou fatura" required />
        <input type="number" id="valor-planejado" placeholder="Valor futuro" required />
        <button type="submit">Adicionar</button>
      </form>
    </div>
    <ul id="lista-planejados"></ul>
  </section>
`;

// Ensure this file contains the necessary imports and logic for other sections

// Handle form submission for "Planejamentos Futuros"
