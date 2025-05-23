import { transacaoService } from '../../services/transacaoService';
import { TransactionList } from './TransactionList';

export class TransactionForm {
    private formElement: HTMLFormElement;
    private rendaAtualInput: HTMLInputElement;
    private transactionList: TransactionList;

    constructor() {
        this.formElement = document.getElementById('form-transacao') as HTMLFormElement;
        this.rendaAtualInput = document.getElementById('renda-atual') as HTMLInputElement;
        this.transactionList = new TransactionList();
        this.init();
    }

    private init(): void {
        this.setupFormListener();
        this.setupRendaAtualListener();
        this.loadRendaAtual();
    }

    private setupFormListener(): void {
        if (!this.formElement) return;

        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    private setupRendaAtualListener(): void {
        if (!this.rendaAtualInput) return;

        this.rendaAtualInput.addEventListener('change', (e: Event) => {
            const valor = parseFloat((e.target as HTMLInputElement).value) || 0;
            transacaoService.setRendaAtual(valor);
            this.transactionList.updateSaldo();
        });
    }

    private loadRendaAtual(): void {
        if (!this.rendaAtualInput) return;

        const rendaAtual = transacaoService.getRendaAtual();
        if (rendaAtual > 0) {
            this.rendaAtualInput.value = rendaAtual.toFixed(2);
        }
    }

    private handleSubmit(): void {
        const descricao = (document.getElementById('descricao') as HTMLInputElement).value;
        const valor = parseFloat((document.getElementById('valor') as HTMLInputElement).value);
        const tipo = (document.getElementById('tipo') as HTMLSelectElement).value as 'renda' | 'despesa';

        if (isNaN(valor) || valor <= 0) {
            alert('Insira um valor válido.');
            return;
        }

        transacaoService.adicionarTransacao({ descricao, valor, tipo });
        this.transactionList.updateListaTransacoes();
        this.transactionList.updateSaldo();
        this.formElement.reset();
    }
} 