document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('signup-form');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://127.0.0.1:8081/api/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {

            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;
        const firstname = document.getElementById('signup-firstname').value;
        const lastname = document.getElementById('signup-lastname').value;

        try {
            const response = await fetch('http://127.0.0.1:8081/api/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password, firstname, lastname })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
        } catch (error) {
            console.error('Error registering:', error);
        }
    });

    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const loginContainer = document.getElementById("login");
    const signupContainer = document.getElementById("signup");
    loginBtn.addEventListener("click", function () {
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
        loginContainer.classList.remove("hidden");
        signupContainer.classList.add("hidden");
    });

    signupBtn.addEventListener("click", function () {
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
        signupContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
    });
});
