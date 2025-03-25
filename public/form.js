const cpf = document.getElementById("cpf");
const cep = document.getElementById("cep");
const street = document.getElementById("rua");
const city = document.getElementById("cidade");
const state = document.getElementById("estado");
const inputFiles = document.querySelectorAll(".file-container");

$('#cep').mask('00000-000', { placeholder: "00000-000" });
$('#cpf').mask('000.000.000-00', { placeholder: "123.456.789-00" });
$('#telefone').mask('(00) 00000-0000', { placeholder: "(00) 00000-0000" });

cpf.onchange = function () {
    const cleanCpf = cpf.value.replace(/[\.\-]/g, "");
    const result = TestaCPF(cleanCpf);
    cpf.setCustomValidity(result ? "" : "Cpf Invalido");
}

cep.onchange = async function (e) {
    if (cep.value.length != 9) return;

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
        const data = await res.json();

        setAddressValues(data);
        cep.setCustomValidity('');
    } catch (e) {
        cep.setCustomValidity("CEP Inválido");
        console.error("Cep nao encontrado, verifique novamente");
    }

}

for (let fileContainer of inputFiles) {
    setShowFilename(fileContainer);
}

function setAddressValues(data) {
    street.value = data.logradouro;
    city.value = data.localidade;
    state.value = data.uf;
}

function setShowFilename(fileContainer) {
    const fileInput    = fileContainer.querySelector("input");
    const filename     = fileContainer.querySelector("p");
    const standartText = filename.innerText;

    fileInput.addEventListener("input", () => {
        filename.innerText = standartText;

        if (fileInput.files[0]) {
            filename.innerText = fileInput.files[0].name 
        }
    })
}

// Armazenamento de informações ja cadastradas
const signupState = JSON.parse(localStorage.getItem("signupState") || "{}");
const allInputs = document.querySelectorAll("input:not([type=file]), select");
console.log(signupState, allInputs);

// Ao iniciar carregar informacoes do localstorage
for (const field of Object.keys(signupState)) {
    const input = document.getElementById(field);
    input.value = signupState[field];
}

// Todas as alteracões devem ser armazenadas
for (const input of allInputs) {
    input.addEventListener("input", () => {
        signupState[input.id] = input.value;
        localStorage.setItem("signupState", JSON.stringify(signupState));
        console.log(signupState);
    }) 
}

// Remover informações quando cadastro for finalizado


/* 
    Fonte do código 
    Cógido de verificação de CPF 
    Fonte: https://www.devmedia.com.br/validar-cpf-com-javascript/23916
    autor: Gregory
*/

function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}


document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById('submitBtn');
    const radioContainer = document.querySelector('.radio-container');

    // Função para buscar as trilhas
    function buscarTrilhas() {
        fetch('/api/trilhas')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Gerando os inputs radio dinamicamente
                    data.trilhas.forEach(trilha => {
                        const radioCard = document.createElement('div');
                        radioCard.classList.add('radio-card');

                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.id = `trilha-${trilha.id}`;
                        input.name = 'trilha';
                        input.value = trilha.id;  // Usando o ID da trilha como valor
                        input.required = true;

                        const label = document.createElement('label');
                        label.setAttribute('for', `trilha-${trilha.id}`);
                        
                        const img = document.createElement('img');
                        img.src = `imgs/${trilha.titulo.toLowerCase().replace(/\s+/g, '-')}-icon.svg`;  // Gerando o nome da imagem com base no título da trilha
                        img.alt = trilha.titulo;

                        const text = document.createTextNode(trilha.titulo);

                        label.appendChild(img);
                        label.appendChild(text);
                        radioCard.appendChild(input);
                        radioCard.appendChild(label);

                        radioContainer.appendChild(radioCard);
                    });
                } else {
                    alert("Erro ao carregar as trilhas.");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar as trilhas:", error);
                alert("Erro ao se comunicar com o servidor.");
            });
    }

    // Função para enviar o cadastro
    function enviarCadastro(event) {
        event.preventDefault(); 
        
        const nome = document.getElementById('nome').value;
        const dataNascimento = document.getElementById('dt_nasc').value;
        const cpf = document.getElementById('cpf').value;
        const sexo = document.getElementById('sexo').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const senha = document.getElementById('senha').value;
        const username = document.getElementById('username').value;

        const cep = document.getElementById('cep').value;
        const rua = document.getElementById('rua').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;
        const comprovante = document.getElementById('comprovante').files[0] ? document.getElementById('comprovante').files[0].name : null;

        const trilhaSelecionada = document.querySelector('input[name="trilha"]:checked').value;

        const dados = {
            nome,
            dt_nasc,
            cpf,
            sexo,
            email,
            telefone,
            senha,
            username,
            endereco: {
                cep,
                rua,
                cidade,
                estado,
                comprovante
            },
            role: 1,  
            trilha: trilhaSelecionada
        };

        fetch('/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Cadastro realizado com sucesso!");
            } else {
                alert(data.message || "Erro ao realizar o cadastro.");
            }
        })
        .catch(error => {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao se comunicar com o servidor.");
        });
    }

    // Buscar trilhas e preencher o formulário
    buscarTrilhas();

    // Adicionando o ouvinte de evento para o botão de envio
    submitButton.addEventListener('click', enviarCadastro);
});