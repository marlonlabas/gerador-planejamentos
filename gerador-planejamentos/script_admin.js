document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário é admin
    if (localStorage.getItem('currentUser') !== 'admin') {
        alert('Acesso restrito ao administrador!');
        window.location.href = 'index.html';
        return;
    }

    // Função para redimensionar textarea automaticamente
    function autoResizeTextarea(textarea) {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            console.error('Textarea não encontrado para redimensionamento.');
        }
    }

    // Função para cadastrar professor e componentes
    window.cadastrarProfessor = function() {
        const nomeProfessor = document.getElementById('nomeProfessor')?.value.trim();
        const loginProfessor = document.getElementById('loginProfessor')?.value.trim();
        const senhaProfessor = document.getElementById('senhaProfessor')?.value.trim();
        const componentesText = document.getElementById('componentesCurriculares')?.value.trim();

        if (!nomeProfessor || !loginProfessor || !senhaProfessor || !componentesText) {
            alert('Por favor, preencha todos os campos: nome, login, senha e pelo menos um componente curricular.');
            return;
        }

        const componentes = componentesText.split('\n').map(item => item.trim()).filter(item => item);

        // Carregar dados existentes
        let professores = JSON.parse(localStorage.getItem('professores')) || [];
        let professoresComponentes = JSON.parse(localStorage.getItem('professoresComponentes')) || {};
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let professorLogins = JSON.parse(localStorage.getItem('professorLogins')) || {};

        // Verificar se o professor ou login já existe
        if (professores.includes(nomeProfessor)) {
            alert('Este professor já está cadastrado!');
            return;
        }
        if (users.find(u => u.username === loginProfessor)) {
            alert('Este login já está em uso!');
            return;
        }

        // Adicionar professor
        professores.push(nomeProfessor);
        localStorage.setItem('professores', JSON.stringify(professores));

        // Adicionar componentes associados
        professoresComponentes[nomeProfessor] = componentes;
        localStorage.setItem('professoresComponentes', JSON.stringify(professoresComponentes));

        // Adicionar usuário
        users.push({ username: loginProfessor, password: btoa(senhaProfessor) });
        localStorage.setItem('users', JSON.stringify(users));

        // Adicionar mapeamento login -> nomeProfessor
        professorLogins[loginProfessor] = nomeProfessor;
        localStorage.setItem('professorLogins', JSON.stringify(professorLogins));

        alert('Professor e componentes cadastrados com sucesso!');
        document.getElementById('professorForm').reset();
        autoResizeTextarea(document.getElementById('componentesCurriculares'));
        loadProfessoresCadastrados();
    };

    // Função para excluir professor
    window.excluirProfessor = function(nomeProfessor, loginProfessor) {
        if (!confirm(`Tem certeza que deseja excluir o professor ${nomeProfessor}?`)) {
            return;
        }

        // Carregar dados existentes
        let professores = JSON.parse(localStorage.getItem('professores')) || [];
        let professoresComponentes = JSON.parse(localStorage.getItem('professoresComponentes')) || {};
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let planosSalvos = JSON.parse(localStorage.getItem('planosSalvos')) || [];
        let professorLogins = JSON.parse(localStorage.getItem('professorLogins')) || {};

        // Remover professor
        professores = professores.filter(prof => prof !== nomeProfessor);
        localStorage.setItem('professores', JSON.stringify(professores));

        // Remover componentes associados
        delete professoresComponentes[nomeProfessor];
        localStorage.setItem('professoresComponentes', JSON.stringify(professoresComponentes));

        // Remover usuário
        users = users.filter(user => user.username !== loginProfessor);
        localStorage.setItem('users', JSON.stringify(users));

        // Remover mapeamento login -> nomeProfessor
        delete professorLogins[loginProfessor];
        localStorage.setItem('professorLogins', JSON.stringify(professorLogins));

        // Remover planos associados
        planosSalvos = planosSalvos.filter(plano => plano.nomeProfessor !== nomeProfessor);
        localStorage.setItem('planosSalvos', JSON.stringify(planosSalvos));

        alert('Professor excluído com sucesso!');
        loadProfessoresCadastrados();
    };

    // Função para carregar lista de professores cadastrados
    function loadProfessoresCadastrados() {
        const listaProfessores = document.getElementById('listaProfessores');
        if (!listaProfessores) {
            console.error('Elemento listaProfessores não encontrado!');
            return;
        }

        listaProfessores.innerHTML = '';
        const professores = JSON.parse(localStorage.getItem('professores')) || [];
        const professoresComponentes = JSON.parse(localStorage.getItem('professoresComponentes')) || {};
        const professorLogins = JSON.parse(localStorage.getItem('professorLogins')) || {};

        if (professores.length === 0) {
            listaProfessores.innerHTML = '<p>Nenhum professor cadastrado.</p>';
            return;
        }

        professores.forEach(professor => {
            const componentes = professoresComponentes[professor] || [];
            const login = Object.keys(professorLogins).find(key => professorLogins[key] === professor) || 'N/A';
            const p = document.createElement('p');
            p.innerHTML = `${professor} (Login: ${login}): ${componentes.length > 0 ? componentes.join(', ') : 'Nenhum componente cadastrado'} <button class="delete-button" onclick="excluirProfessor('${professor}', '${login}')">Excluir</button>`;
            listaProfessores.appendChild(p);
        });
    }

    // Função para mostrar/esconder a seção de cadastro de professores
    window.mostrarCadastroProfessores = function() {
        const cadastroSection = document.getElementById('cadastroProfessores');
        if (cadastroSection) {
            cadastroSection.style.display = cadastroSection.style.display === 'none' ? 'block' : 'none';
        } else {
            console.error('Seção cadastroProfessores não encontrada!');
        }
    };

    // Inicializar textarea
    const textarea = document.getElementById('componentesCurriculares');
    if (textarea) {
        autoResizeTextarea(textarea);
        textarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }

    // Carregar lista de professores na inicialização
    loadProfessoresCadastrados();
});

// Função de logout
window.logout = function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};