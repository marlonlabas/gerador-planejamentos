// Verificar se o usuário está logado
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

window.logout = function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Captura os valores dos campos
        const nomeProfessor = document.getElementById('nomeProfessor').value.trim();
        const nomeEscola = document.getElementById('nomeEscola').value.trim();
        const componenteCurricular = document.getElementById('componenteCurricular').value;

        // Validação básica
        if (!nomeProfessor || !nomeEscola || !componenteCurricular) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Salva os dados no localStorage
        let professores = JSON.parse(localStorage.getItem('professores')) || [];
        let escolas = JSON.parse(localStorage.getItem('escolas')) || [];
        let componentesCurriculares = JSON.parse(localStorage.getItem('componentesCurriculares')) || ['Física', 'Matemática', 'Português'];

        if (!professores.includes(nomeProfessor)) {
            professores.push(nomeProfessor);
            localStorage.setItem('professores', JSON.stringify(professores));
        }
        if (!escolas.includes(nomeEscola)) {
            escolas.push(nomeEscola);
            localStorage.setItem('escolas', JSON.stringify(escolas));
        }
        if (!componentesCurriculares.includes(componenteCurricular)) {
            componentesCurriculares.push(componenteCurricular);
            localStorage.setItem('componentesCurriculares', JSON.stringify(componentesCurriculares));
        }

        // Exibe confirmação
        const mensagem = `Cadastro salvo:\n- Nome: ${nomeProfessor}\n- Escola: ${nomeEscola}\n- Componente Curricular: ${componenteCurricular}`;
        alert(mensagem);

        // Gera PDF com os dados
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(12);
        doc.text('Cadastro de Professor', 105, 20, null, null, 'center');
        doc.text(`Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`, 105, 30, null, null, 'center');
        doc.text(`Nome: ${nomeProfessor}`, 20, 50);
        doc.text(`Unidade Escolar: ${nomeEscola}`, 20, 60);
        doc.text(`Componente Curricular: ${componenteCurricular}`, 20, 70);

        // Salva o PDF com o nome do professor
        const fileName = `cadastro_${nomeProfessor.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);

        // Limpa o formulário
        form.reset();
    });
});