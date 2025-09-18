// script_index.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página Início carregada.');
    // Adicione aqui funcionalidades específicas para a página inicial, se necessário
});

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
    }

    console.log('Página Início carregada.');
});

window.logout = function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};