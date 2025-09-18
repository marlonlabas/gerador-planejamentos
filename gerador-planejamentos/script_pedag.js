document.addEventListener('DOMContentLoaded', function() {
    // Função para ajustar a altura do textarea dinamicamente
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; // Reseta a altura
        textarea.style.height = Math.max(textarea.scrollHeight, 50) + 'px'; // Ajusta para o conteúdo ou mínimo de 50px
    }

    // Adiciona evento de input para ajustar a altura dos textareas
    ['habilidadeInput', 'criterioInput', 'instrumentoInput'].forEach(id => {
        const textarea = document.getElementById(id);
        textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
    });

    // Função para salvar itens avulsos
    window.saveItem = function(type) {
        let input, storageKey, messagePrefix;
        switch (type) {
            case 'habilidade':
                input = document.getElementById('habilidadeInput');
                storageKey = 'habilidades';
                messagePrefix = 'Habilidade';
                break;
            case 'criterio':
                input = document.getElementById('criterioInput');
                storageKey = 'criteriosAvaliacao';
                messagePrefix = 'Critério de Avaliação';
                break;
            case 'instrumento':
                input = document.getElementById('instrumentoInput');
                storageKey = 'instrumentosAvaliacao';
                messagePrefix = 'Instrumento de Avaliação';
                break;
        }

        const value = input.value.trim();
        if (!value) {
            alert('Por favor, preencha o campo!');
            return;
        }

        let items = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (!items.includes(value)) {
            items.push(value);
            localStorage.setItem(storageKey, JSON.stringify(items));
        }

        const mensagem = `${messagePrefix} salvo: ${value}`;
        alert(mensagem);

        // Limpa o campo após salvar
        input.value = '';
        adjustTextareaHeight(input);
    };
});

// Verificar se o usuário está logado
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

window.logout = function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};