export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'renda' | 'despesa';
    data: string;
}

export interface TransacaoFormData {
    descricao: string;
    valor: number;
    tipo: 'renda' | 'despesa';
} 