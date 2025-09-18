document.addEventListener('DOMContentLoaded', function() {
    // Usuário padrão para testes (em produção, use um sistema seguro)
    const defaultUser = {
        username: 'admin',
        password: btoa('admin123') // Senha codificada em base64
    };

    // Inicializar usuários no localStorage, se não existir
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([defaultUser]));
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Carregar usuários do localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === btoa(password));

            if (user) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('currentUser', username);
                alert('Login bem-sucedido!');
                window.location.href = username === 'admin' ? 'admin.html' : 'index.html';
            } else {
                alert('Usuário ou senha incorretos!');
            }
        });
    } else {
        console.error('Formulário de login (loginForm) não encontrado!');
    }
});

window.logout = function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};