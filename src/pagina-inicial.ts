// DOM Elements - Pegando elementos do HTML com tipagem adequada
const formTransacao = document.getElementById('form-transacao') as HTMLFormElement;
const listaTransacoes = document.getElementById('lista-transacoes') as HTMLUListElement;
const saldoElement = document.getElementById('saldo') as HTMLSpanElement;
const rendaAtualInput = document.getElementById('renda-atual') as HTMLInputElement;

// Interface para definir a estrutura das transações
interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'renda' | 'despesa';
    data: string;
}

// Estado - Variáveis para armazenar as transações e a renda atual
let transacoes: Transacao[] = [];
let rendaAtual: number = 0;

// Recupera dados do localStorage e evita erros na leitura
try {
    const transacoesSalvas = localStorage.getItem('transacoes');
    transacoes = transacoesSalvas ? JSON.parse(transacoesSalvas) : [];
} catch (e) {
    console.error('Erro ao carregar transações:', e);
}

try {
    const rendaSalva = localStorage.getItem('rendaAtual');
    rendaAtual = rendaSalva ? parseFloat(rendaSalva) : 0;
} catch (e) {
    console.error('Erro ao carregar rendaAtual:', e);
}

// Inicialização da interface com os valores corretos
updateSaldo();
updateListaTransacoes();
if (rendaAtual > 0 && rendaAtualInput) {
    rendaAtualInput.value = rendaAtual.toFixed(2);
}

// Eventos
if (formTransacao) {
    formTransacao.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const descricao = (document.getElementById('descricao') as HTMLInputElement).value;
        const valor = parseFloat((document.getElementById('valor') as HTMLInputElement).value);
        const tipo = (document.getElementById('tipo') as HTMLSelectElement).value as 'renda' | 'despesa';

        if (isNaN(valor) || valor <= 0) {
            alert('Insira um valor válido.');
            return;
        }

        const transacao: Transacao = {
            id: Date.now(),
            descricao,
            valor,
            tipo,
            data: new Date().toLocaleDateString(),
        };

        transacoes.push(transacao);
        saveTransacoes();
        updateSaldo();
        updateListaTransacoes();
        formTransacao.reset();
    });
}

if (rendaAtualInput) {
    rendaAtualInput.addEventListener('change', (e: Event) => {
        rendaAtual = parseFloat((e.target as HTMLInputElement).value) || 0;
        localStorage.setItem('rendaAtual', rendaAtual.toString());
        updateSaldo();
    });
}

// Função para atualizar o saldo
function updateSaldo(): void {
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

// Atualiza a lista de transações na tela
function updateListaTransacoes(): void {
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

// Função para remover uma transação
function removerTransacao(id: number): void {
    transacoes = transacoes.filter(t => t.id !== id);
    saveTransacoes();
    updateSaldo();
    updateListaTransacoes();
}

// Salva as transações no localStorage e verifica autenticação
function saveTransacoes(): void {
    const nome = localStorage.getItem('nomeUsuario');
    if (!nome) {
        alert('Usuário não autenticado. Redirecionando para a página de login.');
        window.location.href = '../login/login.html';
    }
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

// Expondo a função global para o HTML
(window as any).removerTransacao = removerTransacao;
