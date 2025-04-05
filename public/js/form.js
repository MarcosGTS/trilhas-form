import { modal } from "./modal.js";
import { basicConffeti } from "./deafultConffeties.js";

modal.redirect = "/";

const form = document.getElementById("form");
const submitBtn = document.getElementById("submitBtn");
const cpf = document.getElementById("cpf");
const cep = document.getElementById("cep");
const street = document.getElementById("rua");
const city = document.getElementById("cidade");
const state = document.getElementById("estado");
const password = document.getElementById("password");
const confPass = document.getElementById("password-confirm");
const inputFiles = document.querySelectorAll(".file-container");

const disabledInputs = document.querySelectorAll("input:disabled");

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

function setAddressValues(data) {
    const changedEvent = new Event('change');

    street.value = data.logradouro;
    street.dispatchEvent(changedEvent);

    city.value = data.localidade;
    city.dispatchEvent(changedEvent);

    state.value = data.uf;
    state.dispatchEvent(changedEvent);
}

password.oninput = checkConfPass;
confPass.oninput = checkConfPass;

function checkConfPass() {
    if (password.value == confPass.value) {
        confPass.setCustomValidity('');
    } else {
        confPass.setCustomValidity("As senhas não conferem.")
    }
} 

submitBtn.addEventListener("click", (e) =>  {
    e.preventDefault();

    // Show up modal
    if (form.checkValidity()) {
        // show loading modal 
        modal.show()
        const formData = new FormData(form);

        for (let input of disabledInputs) {
            formData.append(input.name, input.value);
        }

        // Send form infos via fetch
        fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.setImage("/imgs/check-radio.svg");
                formClear();
                basicConffeti();
            } else {
                modal.setImage("/imgs/error-icon.svg");
            }

            modal.setText(data.message);
        })
        .catch(error => {
            modal.setText(error);
            modal.setImage("/imgs/error-icon.svg");
        });    

    } else {
        form.reportValidity();
    }

});

for (let fileContainer of inputFiles) {
    setShowFilename(fileContainer);
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
const allInputs = document.querySelectorAll("input:not([type=file]):not([type=password]), select");

// Ao iniciar carregar informacoes do localstorage
for (const input of allInputs) {
    if (input.type === "radio") {
        const field = input.name;
        input.checked = (signupState[field] === input.id);
    } else {
        const field = input.id;
        input.value = signupState[field] || "";
    }
}

// Todas as alteracões devem ser armazenadas
for (const input of allInputs) {
    input.addEventListener("change", () => {
        if (input.type === "radio") {
            signupState[input.name] = input.id;
        } else {
            signupState[input.id] = input.value;
        }
        localStorage.setItem("signupState", JSON.stringify(signupState));
    }) 
}

// Remover informações quando cadastro for finalizado
const cancelBtn = document.getElementById("cancelBtn");

cancelBtn.onclick = formClear; 

function formClear() {
    const allInputs = document.querySelectorAll("input, select");

    for (let input of allInputs) {
        input.value = "";
    }

    localStorage.setItem("signupState", "{}");
}

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