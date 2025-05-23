import { transacaoService } from '../../services/transacaoService';
import { Transacao } from '../../types';

export class TransactionList {
    private listaElement: HTMLUListElement;
    private saldoElement: HTMLSpanElement;

    constructor() {
        this.listaElement = document.getElementById('lista-transacoes') as HTMLUListElement;
        this.saldoElement = document.getElementById('saldo') as HTMLSpanElement;
        this.init();
    }

    private init(): void {
        this.updateListaTransacoes();
        this.updateSaldo();
    }

    public updateListaTransacoes(): void {
        if (!this.listaElement) return;

        this.listaElement.innerHTML = '';
        const transacoes = transacaoService.getTransacoes();

        transacoes.forEach(transacao => {
            const li = this.createTransactionElement(transacao);
            this.listaElement.appendChild(li);
        });
    }

    private createTransactionElement(transacao: Transacao): HTMLLIElement {
        const li = document.createElement('li');
        li.className = transacao.tipo;
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
                <div style="flex: 2; margin-right: 15px;">${transacao.descricao}</div>
                <div style="flex: 1; text-align: right; margin-right: 15px;">R$ ${transacao.valor.toFixed(2)}</div>
                <div style="flex: 1; text-align: center; margin-right: 15px;">${transacao.data}</div>
                <button onclick="window.handleRemoverTransacao(${transacao.id})" style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">X</button>
            </div>
        `;
        return li;
    }

    public updateSaldo(): void {
        if (!this.saldoElement) return;
        const saldo = transacaoService.calcularSaldo();
        this.saldoElement.textContent = `R$ ${saldo.toFixed(2)}`;
    }
}

// Global handler for removing transactions
window.handleRemoverTransacao = (id: number) => {
    transacaoService.removerTransacao(id);
    const transactionList = new TransactionList();
    transactionList.updateListaTransacoes();
    transactionList.updateSaldo();
};

// Add the handler type to the window object
declare global {
    interface Window {
        handleRemoverTransacao: (id: number) => void;
    }
} 