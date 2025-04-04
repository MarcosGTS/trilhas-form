const body = document.querySelector("body");
const themeBtn = document.querySelector(".theme__button");

// Load theme state
const theme = localStorage.getItem("theme");

if (theme) {
    body.classList.add(theme);
}

setThemeState();

themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
   setThemeState() 
})

function setThemeState() {
    if (body.classList.contains("dark-mode")) {
        themeBtn.innerHTML = "Tema claro";
        localStorage.setItem("theme", "dark-mode");
    } else {
        themeBtn.innerHTML = "Tema escuro";
        localStorage.setItem("theme", "");
    }
}