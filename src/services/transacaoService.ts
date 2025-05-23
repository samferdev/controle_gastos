import { Transacao, TransacaoFormData } from '../types';

class TransacaoService {
    private transacoes: Transacao[] = [];
    private rendaAtual: number = 0;

    constructor() {
        this.loadTransacoes();
        this.loadRendaAtual();
    }

    private loadTransacoes(): void {
        try {
            const transacoesSalvas = localStorage.getItem('transacoes');
            this.transacoes = transacoesSalvas ? JSON.parse(transacoesSalvas) : [];
        } catch (e) {
            console.error('Erro ao carregar transações:', e);
            this.transacoes = [];
        }
    }

    private loadRendaAtual(): void {
        try {
            const rendaSalva = localStorage.getItem('rendaAtual');
            this.rendaAtual = rendaSalva ? parseFloat(rendaSalva) : 0;
        } catch (e) {
            console.error('Erro ao carregar rendaAtual:', e);
            this.rendaAtual = 0;
        }
    }

    public getTransacoes(): Transacao[] {
        return this.transacoes;
    }

    public getRendaAtual(): number {
        return this.rendaAtual;
    }

    public setRendaAtual(valor: number): void {
        this.rendaAtual = valor;
        localStorage.setItem('rendaAtual', valor.toString());
    }

    public adicionarTransacao(data: TransacaoFormData): void {
        const transacao: Transacao = {
            id: Date.now(),
            ...data,
            data: new Date().toLocaleDateString()
        };

        this.transacoes.push(transacao);
        this.saveTransacoes();
    }

    public removerTransacao(id: number): void {
        this.transacoes = this.transacoes.filter(t => t.id !== id);
        this.saveTransacoes();
    }

    public calcularSaldo(): number {
        const totalDespesas = this.transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((sum, t) => sum + t.valor, 0);

        const totalRenda = this.transacoes
            .filter(t => t.tipo === 'renda')
            .reduce((sum, t) => sum + t.valor, 0);

        return this.rendaAtual + totalRenda - totalDespesas;
    }

    private saveTransacoes(): void {
        const nome = localStorage.getItem('nomeUsuario');
        if (!nome) {
            alert('Usuário não autenticado. Redirecionando para a página de login.');
            window.location.href = '../login/login.html';
            return;
        }
        localStorage.setItem('transacoes', JSON.stringify(this.transacoes));
    }
}

export const transacaoService = new TransacaoService(); 