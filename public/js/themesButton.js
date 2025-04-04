const body = document.querySelector("body");
const themeBtn = document.querySelector(".theme__button");

themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    themeBtn.innerHTML = body.classList.contains("dark-mode") ? "Tema claro" : "Tema escuro";
})