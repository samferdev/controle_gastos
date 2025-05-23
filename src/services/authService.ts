export class AuthService {
    private static readonly STORAGE_KEY = 'nomeUsuario';

    public isAuthenticated(): boolean {
        return !!this.getNomeUsuario();
    }

    public getNomeUsuario(): string | null {
        return localStorage.getItem(AuthService.STORAGE_KEY);
    }

    public login(nome: string): void {
        if (!nome.trim()) {
            throw new Error('Nome é obrigatório');
        }
        localStorage.setItem(AuthService.STORAGE_KEY, nome);
    }

    public logout(): void {
        localStorage.removeItem(AuthService.STORAGE_KEY);
        localStorage.removeItem('transacoes');
        localStorage.removeItem('rendaAtual');
        window.location.href = '/components/login/login.html';
    }

    public checkAuth(): void {
        if (!this.isAuthenticated()) {
            window.location.href = '/components/login/login.html';
        }
    }
}

export const authService = new AuthService(); 