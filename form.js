// Validação e armazenamento temporário
const cpf = document.getElementById("cpf");
const cep = document.getElementById("cep");
const street = document.getElementById("rua");
const city = document.getElementById("cidade");
const state = document.getElementById("estado");
const inputFiles = document.querySelectorAll(".file-container");
const userId = document.getElementById("user-id");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const submitBtn = document.getElementById("submitBtn");
const form = document.querySelector("form");

// Aplicando máscaras de entrada
$('#cep').mask('00000-000', { placeholder: "00000-000" });
$('#cpf').mask('000.000.000-00', { placeholder: "123.456.789-00" });
$('#telefone').mask('(00) 00000-0000', { placeholder: "(00) 00000-0000" });

// Validação de CPF
cpf.onchange = function () {
    const cleanCpf = cpf.value.replace(/[\.\-]/g, "");
    const result = TestaCPF(cleanCpf);
    cpf.setCustomValidity(result ? "" : "CPF inválido");
}

// Validação de CEP e preenchimento automático
cep.onchange = async function (e) {
    if (cep.value.length != 9) return;

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
        const data = await res.json();

        setAddressValues(data);
        cep.setCustomValidity('');
    } catch (e) {
        cep.setCustomValidity("CEP Inválido");
        console.error("CEP não encontrado, verifique novamente");
    }
}

// Verificação de disponibilidade de username
if (userId) {
    userId.addEventListener("blur", async function() {
        if (userId.value.length < 3) return;
        
        try {
            const response = await fetch(`/api/check-username/${userId.value}`);
            const data = await response.json();
            
            if (!data.available) {
                userId.setCustomValidity("Este nome de usuário já está em uso");
                showError(userId, "Este nome de usuário já está em uso");
            } else {
                userId.setCustomValidity("");
                hideError(userId);
            }
        } catch (error) {
            console.error("Erro ao verificar disponibilidade de username:", error);
        }
    });
}

// Validação de confirmação de senha
if (password && passwordConfirm) {
    passwordConfirm.addEventListener("input", function() {
        if (password.value !== passwordConfirm.value) {
            passwordConfirm.setCustomValidity("As senhas não coincidem");
            showError(passwordConfirm, "As senhas não coincidem");
        } else {
            passwordConfirm.setCustomValidity("");
            hideError(passwordConfirm);
        }
    });

    password.addEventListener("input", function() {
        if (passwordConfirm.value && password.value !== passwordConfirm.value) {
            passwordConfirm.setCustomValidity("As senhas não coincidem");
            showError(passwordConfirm, "As senhas não coincidem");
        } else if (passwordConfirm.value) {
            passwordConfirm.setCustomValidity("");
            hideError(passwordConfirm);
        }
    });
}

// Funções auxiliares para exibir e ocultar erros
function showError(input, message) {
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("form__error")) {
        errorSpan.textContent = message;
        errorSpan.style.display = "flex";
    }
}

function hideError(input) {
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("form__error")) {
        errorSpan.style.display = "none";
    }
}

// Configurar exibição de nomes de arquivos selecionados
for (let fileContainer of inputFiles) {
    setShowFilename(fileContainer);
}

function setAddressValues(data) {
    street.value = data.logradouro;
    city.value = data.localidade;
    state.value = data.uf;
}

function setShowFilename(fileContainer) {
    const fileInput = fileContainer.querySelector("input");
    const filename = fileContainer.querySelector("p");
    const standartText = filename.innerText;

    fileInput.addEventListener("input", () => {
        filename.innerText = standartText;

        if (fileInput.files[0]) {
            filename.innerText = fileInput.files[0].name;
        }
    });
}

// Armazenamento de informações já cadastradas
const signupState = JSON.parse(localStorage.getItem("signupState") || "{}");
const allInputs = document.querySelectorAll("input:not([type=file]), select");

// Ao iniciar carregar informações do localStorage
for (const input of allInputs) {
    if (input.type === "radio") {
        const field = input.name;
        input.checked = (signupState[field] === input.id);
    } else {
        const field = input.id;
        input.value = signupState[field] || "";
    }
}

// Todas as alterações devem ser armazenadas
for (const input of allInputs) {
    input.addEventListener("input", () => {
        if (input.type === "radio") {
            signupState[input.name] = input.id;
        } else {
            signupState[input.id] = input.value;
        }
        localStorage.setItem("signupState", JSON.stringify(signupState));
    });
}

// Adicionar submissão do formulário
if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            // Formulário tem erros de validação
            return;
        }
        
        // Verificar se estamos na página de login ou cadastro
        const isLoginPage = window.location.pathname === "/" || window.location.pathname === "/index.html";
        
        if (isLoginPage) {
            // Processar login
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: document.getElementById('nome').value,
                        password: document.getElementById('password').value
                    }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Login bem-sucedido
                    alert("Login realizado com sucesso!");
                    // Redirecionar ou mostrar dashboard
                    // window.location.href = "/dashboard.html";
                } else {
                    // Login falhou
                    alert(`Erro de login: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                alert("Erro ao fazer login. Tente novamente mais tarde.");
            }
        } else {
            // Processar cadastro
            try {
                // Criar FormData para enviar arquivos
                const formData = new FormData();
                
                // Adicionar dados do usuário como JSON
                const userData = {
                    nome: document.getElementById('nome').value,
                    data_nascimento: document.getElementById('data_nascimento').value,
                    cpf: document.getElementById('cpf').value,
                    sexo: document.getElementById('sexo').value,
                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value,
                    cep: document.getElementById('cep').value,
                    rua: document.getElementById('rua').value,
                    numero: document.getElementById('numero').value,
                    cidade: document.getElementById('cidade').value,
                    estado: document.getElementById('estado').value,
                    trilha: document.querySelector('input[name="trilha"]:checked').value,
                    userId: document.getElementById('user-id').value,
                    password: document.getElementById('password').value
                };
                
                formData.append('userData', JSON.stringify(userData));
                
                // Adicionar arquivos
                const documentoInput = document.getElementById('documento');
                const comprovanteInput = document.getElementById('comprovante');
                
                if (documentoInput.files[0]) {
                    formData.append('documento', documentoInput.files[0]);
                }
                
                if (comprovanteInput.files[0]) {
                    formData.append('comprovante', comprovanteInput.files[0]);
                }
                
                // Enviar para o servidor
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Cadastro bem-sucedido
                    alert("Inscrição realizada com sucesso!");
                    // Limpar localStorage após o cadastro bem-sucedido
                    localStorage.removeItem("signupState");
                    // Redirecionar para login
                    window.location.href = "/index.html";
                } else {
                    // Cadastro falhou
                    alert(`Erro no cadastro: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao fazer cadastro:", error);
                alert("Erro ao fazer cadastro. Tente novamente mais tarde.");
            }
        }
    });
}

// Remover informações quando cadastro for cancelado
const cancelBtn = document.getElementById("cancelBtn");

if (cancelBtn) {
    cancelBtn.onclick = (e) => {
        const allInputs = document.querySelectorAll("input, select");

        for (let input of allInputs) {
            if (input.type === "radio" || input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        }

        localStorage.removeItem("signupState");
        alert("Formulário limpo e dados removidos do armazenamento local.");
    }
}

/* 
    Fonte do código 
    Código de verificação de CPF 
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