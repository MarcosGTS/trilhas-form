const DEFAULT_IMAGE = "/imgs/loading.gif";
const DEFAULT_TEXT  = "Fazendo requisição ...";

const modal = document.querySelector('.modal__background');
const confimBtn = modal.querySelector('.form__button__confirm');

modal.show = function () {
    this.classList.remove("hidde");
}

modal.hidde = function () {
    this.classList.add("hidde");
}

modal.setImage = function (src) {
    const img = modal.querySelector("img");
    img.src = src;
}

modal.setText = function (message) {
    const text = modal.querySelector("p");
    text.innerText = message;
}

confimBtn.addEventListener("click", () => {
    const modal = confimBtn.closest(".modal__background");
    modal.setText(DEFAULT_TEXT);
    modal.setImage(DEFAULT_IMAGE);
    modal.hidde();

    if (modal.redirect) {
        window.location.replace(modal.redirect);
    }
})


export {modal};