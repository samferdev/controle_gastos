// Adicionar a função ao objeto window para acesso global
declare global {
    interface Window {
        simularPlanejamento: (id: number) => void;
        editarPlanejamento: (id: number) => void;
    }
}

export type Planejamento = {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    parcelas?: number;
    dataVencimento?: string; // Data de vencimento para as parcelas
};

export class PlanejamentoModule {
    constructor() {
        this.init();
    }

    private init(): void {
        const formPlanejado = document.getElementById('form-planejado') as HTMLFormElement | null;
        const filtroDataInicio = document.getElementById('filtro-data-inicio') as HTMLInputElement | null;
        const filtroDataFim = document.getElementById('filtro-data-fim') as HTMLInputElement | null;
        const listaPlanejados = document.getElementById('lista-planejados') as HTMLUListElement | null;

        if (formPlanejado) {
            formPlanejado.addEventListener('submit', this.handlePlanejadoSubmit.bind(this));
        }

        if (filtroDataInicio) {
            filtroDataInicio.addEventListener('change', this.updateListaPlanejados.bind(this));
        }

        if (filtroDataFim) {
            filtroDataFim.addEventListener('change', this.updateListaPlanejados.bind(this));
        }

        if (listaPlanejados) {
            listaPlanejados.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'BUTTON' && target.dataset.id) {
                    this.removerPlanejamento(Number(target.dataset.id));
                }
            });
        }

        this.updateListaPlanejados();
        this.updateResumo();

        // Adicionar as funções ao objeto window
        window.simularPlanejamento = this.simularPlanejamento.bind(this);
        window.editarPlanejamento = this.editarPlanejamento.bind(this);
    }

    private handlePlanejadoSubmit(event: Event): void {
        event.preventDefault();

        const descricaoInput = document.getElementById('descricao-planejado') as HTMLInputElement | null;
        const valorInput = document.getElementById('valor-planejado') as HTMLInputElement | null;
        const parcelasInput = document.getElementById('parcelas-planejado') as HTMLInputElement | null;
        const dataVencimentoInput = document.getElementById('data-vencimento-planejado') as HTMLInputElement | null;

        const descricao = descricaoInput?.value.trim() ?? '';
        const valor = parseFloat(valorInput?.value ?? '');
        const parcelas = parseInt(parcelasInput?.value ?? '1');
        const dataVencimento = dataVencimentoInput?.value ?? '';

        if (!descricao || isNaN(valor) || isNaN(parcelas) || parcelas < 1 || !dataVencimento) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        // Converter a data do formato yyyy-mm-dd para dd/mm/yyyy
        const [ano, mes, dia] = dataVencimento.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const planejamento: Planejamento = {
            id: Date.now(),
            descricao,
            valor,
            parcelas,
            data: new Date().toLocaleDateString(),
            dataVencimento: dataFormatada,
        };

        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        planejamentos.push(planejamento);
        localStorage.setItem('planejamentos', JSON.stringify(planejamentos));

        this.updateListaPlanejados();
        this.updateResumo();
        (event.target as HTMLFormElement).reset();
        parcelasInput!.value = '1';
    }

    private updateListaPlanejados(): void {
        const listaPlanejados = document.getElementById('lista-planejados') as HTMLUListElement | null;
        if (!listaPlanejados) return;

        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        const filtroDataInicio = (document.getElementById('filtro-data-inicio') as HTMLInputElement | null)?.value;
        const filtroDataFim = (document.getElementById('filtro-data-fim') as HTMLInputElement | null)?.value;

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
          <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.parcelas || 1}x</div>
          <div style="flex: 1; text-align: center; margin-right: 15px;">${planejamento.data}</div>
          <div style="display: flex; gap: 8px;">
            <button 
              onclick="window.simularPlanejamento(${planejamento.id})" 
              style="background-color: #006400; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
              Simular
            </button>
            <button 
              onclick="window.editarPlanejamento(${planejamento.id})"
              style="background-color: #FFA500; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
              Editar
            </button>
            <button 
              data-id="${planejamento.id}" 
              style="background-color: #cc0000; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
              X
            </button>
          </div>
        </div>
      `;
            listaPlanejados.appendChild(li);
        });
    }

    private updateResumo(): void {
        const totalPlanejadoElement = document.getElementById('total-planejado');
        const saldoAtualElement = document.getElementById('saldo-atual');
        const diferencaElement = document.getElementById('diferenca');

        if (!totalPlanejadoElement || !saldoAtualElement || !diferencaElement) return;

        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        const transacoes = JSON.parse(localStorage.getItem('transacoes') ?? '[]');
        const rendaAtual = parseFloat(localStorage.getItem('rendaAtual') ?? '0');

        const totalPlanejado = planejamentos.reduce((sum, p) => sum + p.valor, 0);

        const totalDespesas = transacoes
            .filter((t: any) => t.tipo === 'despesa')
            .reduce((sum: number, t: any) => sum + t.valor, 0);

        const totalRenda = transacoes
            .filter((t: any) => t.tipo === 'renda')
            .reduce((sum: number, t: any) => sum + t.valor, 0);

        const saldoAtual = rendaAtual + totalRenda - totalDespesas;
        const diferenca = saldoAtual - totalPlanejado;

        totalPlanejadoElement.textContent = `R$ ${totalPlanejado.toFixed(2)}`;
        saldoAtualElement.textContent = `R$ ${saldoAtual.toFixed(2)}`;
        diferencaElement.textContent = `R$ ${diferenca.toFixed(2)}`;
        diferencaElement.className = diferenca >= 0 ? 'positivo' : 'negativo';
    }

    private removerPlanejamento(id: number): void {
        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        const novosPlanejamentos = planejamentos.filter((p) => p.id !== id);
        localStorage.setItem('planejamentos', JSON.stringify(novosPlanejamentos));
        this.updateListaPlanejados();
        this.updateResumo();
    }

    public simularPlanejamento(id: number): void {
        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        const planejamento = planejamentos.find((p) => p.id === id);

        if (!planejamento) {
            alert('Planejamento não encontrado!');
            return;
        }

        const parcelas = planejamento.parcelas || 1;
        const valorPorParcela = planejamento.valor / parcelas;

        // Usar a data de vencimento como base para a simulação
        let dataBase: Date;
        if (planejamento.dataVencimento) {
            const [dia, mes, ano] = planejamento.dataVencimento.split('/');
            dataBase = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        } else {
            dataBase = new Date();
        }

        const simulacao = Array.from({ length: parcelas }, (_, index) => {
            const data = new Date(dataBase);
            data.setMonth(data.getMonth() + index);

            return {
                parcela: index + 1,
                data: data.toLocaleDateString(),
                valor: valorPorParcela
            };
        });

        this.mostrarSimulacao(simulacao, planejamento);
    }

    private mostrarSimulacao(
        simulacao: Array<{ parcela: number; data: string; valor: number }>,
        planejamento: Planejamento
    ): void {
        const modal = document.createElement('div');
        modal.className = 'modal-simulacao';
        modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #222;
      padding: 20px;
      border-radius: 8px;
      z-index: 1000;
      min-width: 300px;
      max-width: 500px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;

        const conteudo = `
      <h3 style="color: white; margin-bottom: 15px;">Simulação: ${planejamento.descricao}</h3>
      <div style="max-height: 300px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; color: white;">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Parcela</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Data</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #444;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${simulacao
                .map(
                    (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #333;">${item.parcela}/${simulacao.length}</td>
                <td style="padding: 8px; border-bottom: 1px solid #333;">${item.data}</td>
                <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">R$ ${item.valor.toFixed(
                        2
                    )}</td>
              </tr>
            `
                )
                .join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">R$ ${planejamento.valor.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button id="fechar-simulacao" style="
        background: #006400;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        margin-top: 15px;
        cursor: pointer;
        width: 100%;
      ">Fechar</button>
    `;

        modal.innerHTML = conteudo;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 999;
    `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const fecharModal = () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        };

        document.getElementById('fechar-simulacao')?.addEventListener('click', fecharModal);
        overlay.addEventListener('click', fecharModal);
    }

    private editarPlanejamento(id: number): void {
        const planejamentos: Planejamento[] = JSON.parse(localStorage.getItem('planejamentos') ?? '[]');
        const planejamento = planejamentos.find((p) => p.id === id);

        if (!planejamento) {
            alert('Planejamento não encontrado!');
            return;
        }

        let dataVencimentoInput = '';
        if (planejamento.dataVencimento) {
            const [dia, mes, ano] = planejamento.dataVencimento.split('/');
            dataVencimentoInput = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        } else {
            const hoje = new Date();
            dataVencimentoInput = hoje.toISOString().split('T')[0];
        }

        const modal = document.createElement('div');
        modal.className = 'modal-edicao';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #222;
            padding: 16px;
            border-radius: 8px;
            z-index: 1000;
            width: 400px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        const conteudo = `
            <h3 style="color: white; margin-bottom: 12px; font-size: 16px;">Editar Planejamento</h3>
            <form id="form-editar-planejamento" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="grid-column: span 2;">
                    <label for="editar-descricao" style="color: white; font-size: 12px; display: block; margin-bottom: 4px;">Descrição:</label>
                    <input 
                        type="text" 
                        id="editar-descricao" 
                        value="${planejamento.descricao}"
                        style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; font-size: 14px;"
                        required
                    >
                </div>
                <div>
                    <label for="editar-valor" style="color: white; font-size: 12px; display: block; margin-bottom: 4px;">Valor:</label>
                    <input 
                        type="number" 
                        id="editar-valor" 
                        value="${planejamento.valor}"
                        style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; font-size: 14px;"
                        required
                        step="0.01"
                        min="0"
                    >
                </div>
                <div>
                    <label for="editar-parcelas" style="color: white; font-size: 12px; display: block; margin-bottom: 4px;">Parcelas:</label>
                    <input 
                        type="number" 
                        id="editar-parcelas" 
                        value="${planejamento.parcelas || 1}"
                        style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; font-size: 14px;"
                        required
                        min="1"
                    >
                </div>
                <div>
                    <label for="editar-data-vencimento" style="color: white; font-size: 12px; display: block; margin-bottom: 4px;">Vencimento:</label>
                    <input 
                        type="date" 
                        id="editar-data-vencimento" 
                        value="${dataVencimentoInput}"
                        style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; font-size: 14px;"
                        required
                    >
                </div>
                <div style="grid-column: span 2; display: flex; gap: 8px; margin-top: 4px;">
                    <button type="submit" style="
                        flex: 1;
                        background: #006400;
                        color: white;
                        border: none;
                        padding: 6px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Salvar</button>
                    <button type="button" id="cancelar-edicao" style="
                        flex: 1;
                        background: #cc0000;
                        color: white;
                        border: none;
                        padding: 6px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Cancelar</button>
                </div>
            </form>
        `;

        modal.innerHTML = conteudo;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const fecharModal = () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        };

        const form = document.getElementById('form-editar-planejamento');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();

            const descricao = (document.getElementById('editar-descricao') as HTMLInputElement).value;
            const valor = parseFloat((document.getElementById('editar-valor') as HTMLInputElement).value);
            const parcelas = parseInt((document.getElementById('editar-parcelas') as HTMLInputElement).value);
            const dataVencimento = (document.getElementById('editar-data-vencimento') as HTMLInputElement).value;

            if (!descricao || isNaN(valor) || isNaN(parcelas) || parcelas < 1 || !dataVencimento) {
                alert('Preencha todos os campos corretamente.');
                return;
            }

            // Converter a data do formato yyyy-mm-dd para dd/mm/yyyy
            const [ano, mes, dia] = dataVencimento.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;

            const planejamentoAtualizado: Planejamento = {
                ...planejamento,
                descricao,
                valor,
                parcelas,
                dataVencimento: dataFormatada
            };

            const planejamentosAtualizados = planejamentos.map(p =>
                p.id === id ? planejamentoAtualizado : p
            );

            localStorage.setItem('planejamentos', JSON.stringify(planejamentosAtualizados));
            this.updateListaPlanejados();
            this.updateResumo();
            fecharModal();
        });

        document.getElementById('cancelar-edicao')?.addEventListener('click', fecharModal);
        overlay.addEventListener('click', fecharModal);
    }
} 