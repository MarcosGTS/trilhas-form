document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('nome');
    const passwordInput = document.getElementById('password');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!loginForm.checkValidity()) {
            return;
        }
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameInput.value,
                    password: passwordInput.value
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Login bem-sucedido
                alert("Login realizado com sucesso!");
                
                // Salvar informações do usuário na sessão
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            } else {
                // Login falhou
                alert("Login falhou: " + data.message);
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao fazer login. Tente novamente mais tarde.");
        }
    });
});