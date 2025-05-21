export function checarAutenticacao() {
    const nome = localStorage.getItem('nomeUsuario');
    
    if (!nome) {
        window.location.href = '../login/login.html';
    }
}
