import { initNavigation } from './navigation';
import { TransactionForm } from './components/transactions/TransactionForm';
import { TransactionList } from './components/transactions/TransactionList';
import { authService } from './services/authService';

// Interface para definir a estrutura das transações
interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'renda' | 'despesa';
    data: string;
}

class PaginaInicial {
    private transacoes: Transacao[] = [];
    private rendaAtual: number = 0;
    private saldoElement: HTMLSpanElement;
    private formTransacao: HTMLFormElement;
    private listaTransacoes: HTMLUListElement;

    constructor() {
        this.saldoElement = document.getElementById('saldo') as HTMLSpanElement;
        this.formTransacao = document.getElementById('form-transacao') as HTMLFormElement;
        this.listaTransacoes = document.getElementById('lista-transacoes') as HTMLUListElement;
        this.carregarDados();
        this.inicializarEventos();
    }

    private carregarDados(): void {
        try {
            const transacoesSalvas = localStorage.getItem('transacoes');
            this.transacoes = transacoesSalvas ? JSON.parse(transacoesSalvas) : [];
        } catch (e) {
            console.error('Erro ao carregar transações:', e);
            this.transacoes = [];
        }

        try {
            const rendaSalva = localStorage.getItem('rendaAtual');
            this.rendaAtual = rendaSalva ? parseFloat(rendaSalva) : 0;
        } catch (e) {
            console.error('Erro ao carregar rendaAtual:', e);
            this.rendaAtual = 0;
        }

        this.atualizarSaldo();
    }

    private inicializarEventos(): void {
        // Configurar edição de saldo
        const editarSaldoBtn = document.getElementById('editar-saldo');
        const editarContainer = document.getElementById('editar-container');

        if (editarSaldoBtn && editarContainer) {
            editarSaldoBtn.addEventListener('click', () => {
                editarContainer.style.display = 'block';
                editarContainer.innerHTML = `
                    <input type="number" id="novo-saldo" step="0.01" min="0" placeholder="Novo saldo">
                    <button onclick="window.confirmarNovoSaldo()">Confirmar</button>
                `;
                editarSaldoBtn.style.display = 'none';
            });
        }

        // Configurar formulário de transação
        if (this.formTransacao) {
            this.formTransacao.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarTransacao();
            });
        }

        // Expor função global para confirmar novo saldo
        (window as any).confirmarNovoSaldo = () => {
            const input = document.getElementById('novo-saldo') as HTMLInputElement;
            const novoSaldo = parseFloat(input.value);

            if (!isNaN(novoSaldo) && novoSaldo >= 0) {
                this.rendaAtual = novoSaldo;
                localStorage.setItem('rendaAtual', novoSaldo.toString());
                this.atualizarSaldo();

                // Resetar interface de edição
                const editarContainer = document.getElementById('editar-container');
                const editarSaldoBtn = document.getElementById('editar-saldo');
                if (editarContainer && editarSaldoBtn) {
                    editarContainer.style.display = 'none';
                    editarContainer.innerHTML = '';
                    editarSaldoBtn.style.display = 'block';
                }
            } else {
                alert('Por favor, insira um valor válido maior ou igual a zero.');
            }
        };

        // Expor função global para remover transação
        (window as any).removerTransacao = (id: number) => {
            this.transacoes = this.transacoes.filter(t => t.id !== id);
            this.salvarTransacoes();
            this.atualizarSaldo();
            this.atualizarListaTransacoes();
        };
    }

    private adicionarTransacao(): void {
        const descricao = (document.getElementById('descricao') as HTMLInputElement).value;
        const valor = parseFloat((document.getElementById('valor') as HTMLInputElement).value);
        const tipo = (document.getElementById('tipo') as HTMLSelectElement).value as 'renda' | 'despesa';

        if (!descricao || isNaN(valor) || valor <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const transacao: Transacao = {
            id: Date.now(),
            descricao,
            valor,
            tipo,
            data: new Date().toLocaleDateString()
        };

        this.transacoes.push(transacao);
        this.salvarTransacoes();
        this.atualizarSaldo();
        this.atualizarListaTransacoes();
        this.formTransacao.reset();
    }

    private atualizarSaldo(): void {
        if (!this.saldoElement) return;

        const totalDespesas = this.transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((sum, t) => sum + t.valor, 0);

        const totalRenda = this.transacoes
            .filter(t => t.tipo === 'renda')
            .reduce((sum, t) => sum + t.valor, 0);

        const saldo = this.rendaAtual + totalRenda - totalDespesas;
        this.saldoElement.textContent = `R$ ${saldo.toFixed(2)}`;
    }

    private atualizarListaTransacoes(): void {
        if (!this.listaTransacoes) return;

        this.listaTransacoes.innerHTML = '';

        if (this.transacoes.length === 0) {
            this.listaTransacoes.innerHTML = '<li class="sem-transacoes">Nenhuma transação encontrada.</li>';
            return;
        }

        this.transacoes.forEach(transacao => {
            const li = document.createElement('li');
            li.className = transacao.tipo;
            li.innerHTML = `
                <div class="transacao-item">
                    <div class="descricao">${transacao.descricao}</div>
                    <div class="valor">R$ ${transacao.valor.toFixed(2)}</div>
                    <div class="data">${transacao.data}</div>
                    <button onclick="window.removerTransacao(${transacao.id})" class="remover-transacao">X</button>
                </div>
            `;
            this.listaTransacoes.appendChild(li);
        });
    }

    private salvarTransacoes(): void {
        const nome = localStorage.getItem('nomeUsuario');
        if (!nome) {
            alert('Usuário não autenticado. Redirecionando para a página de login.');
            window.location.href = '../login/login.html';
            return;
        }
        localStorage.setItem('transacoes', JSON.stringify(this.transacoes));
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    authService.checkAuth();

    // Initialize navigation
    initNavigation();

    // Initialize main page functionality
    new PaginaInicial();

    // Display user name
    const nomeUsuarioSpan = document.getElementById('nomeUsuario');
    if (nomeUsuarioSpan) {
        nomeUsuarioSpan.textContent = authService.getNomeUsuario() || '';
    }
});
