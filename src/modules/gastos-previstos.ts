interface GastoPrevisto {
    id: number;
    descricao: string;
    valor: number;
    data: string;
}

class GastosPrevistos {
    private gastos: GastoPrevisto[] = [];
    private formElement: HTMLFormElement | null;
    private listaElement: HTMLUListElement | null;

    constructor() {
        this.formElement = document.getElementById('form-planejado') as HTMLFormElement;
        this.listaElement = document.getElementById('lista-planejados') as HTMLUListElement;
        this.init();
    }

    private init(): void {
        this.carregarGastos();
        this.setupEventListeners();
        this.renderizarGastos();
    }

    private carregarGastos(): void {
        const gastosJSON = localStorage.getItem('gastos-previstos');
        if (gastosJSON) {
            this.gastos = JSON.parse(gastosJSON);
        }
    }

    private salvarGastos(): void {
        localStorage.setItem('gastos-previstos', JSON.stringify(this.gastos));
    }

    private setupEventListeners(): void {
        this.formElement?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarGasto();
        });
    }

    private adicionarGasto(): void {
        const descricaoInput = document.getElementById('descricao-planejado') as HTMLInputElement;
        const valorInput = document.getElementById('valor-planejado') as HTMLInputElement;

        const descricao = descricaoInput.value.trim();
        const valor = parseFloat(valorInput.value);

        if (descricao && !isNaN(valor) && valor > 0) {
            const gasto: GastoPrevisto = {
                id: Date.now(),
                descricao,
                valor,
                data: new Date().toLocaleDateString()
            };

            this.gastos.push(gasto);
            this.salvarGastos();
            this.renderizarGastos();
            this.formElement?.reset();
        }
    }

    private removerGasto(id: number): void {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.salvarGastos();
        this.renderizarGastos();
    }

    private renderizarGastos(): void {
        if (!this.listaElement) return;

        this.listaElement.innerHTML = '';
        this.gastos.forEach(gasto => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="gasto-item">
                    <span class="descricao">${gasto.descricao}</span>
                    <span class="valor">R$ ${gasto.valor.toFixed(2)}</span>
                    <span class="data">${gasto.data}</span>
                    <button class="remover-btn" data-id="${gasto.id}">X</button>
                </div>
            `;

            const removerBtn = li.querySelector('.remover-btn');
            removerBtn?.addEventListener('click', () => {
                this.removerGasto(gasto.id);
            });

            this.listaElement?.appendChild(li);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GastosPrevistos();
}); 