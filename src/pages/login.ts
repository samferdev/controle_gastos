import { authService } from '../services/authService';

class LoginPage {
    private form: HTMLFormElement;
    private nomeInput: HTMLInputElement;

    constructor() {
        this.form = document.getElementById('loginForm') as HTMLFormElement;
        this.nomeInput = document.getElementById('nomeUsuario') as HTMLInputElement;
        this.init();
    }

    private init(): void {
        // Redirect if already logged in
        if (authService.isAuthenticated()) {
            window.location.href = '/components/pagina-inicial.html';
            return;
        }

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        const nome = this.nomeInput.value.trim();

        try {
            authService.login(nome);
            window.location.href = '/components/pagina-inicial.html';
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao fazer login');
        }
    }
}

// Initialize the login page
new LoginPage(); 