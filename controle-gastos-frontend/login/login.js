const nomeInput = document.getElementById('nomeUsuario');

function salvarNome() {
    const nome = nomeInput.value.trim();

    if (nome) {
        localStorage.setItem('nomeUsuario', nome);
        window.location.href = '../pagina-inicial/pagina-inicial.html';
    } else {
        alert('Por favor, digite seu nome!');
    }
}
