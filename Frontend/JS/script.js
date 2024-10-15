document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Get Started button action
    const ctaButton = document.querySelector('.hero .btn-primary');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = "file:///C:/Users/rahil/OneDrive/AI%20Tutor%20Website/AI-Tutor/Frontend/HTML/signin.html";
        });
    }

    // Add animation to cards on scroll
    const cards = document.querySelectorAll('.card');
    const animateCards = () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            if (cardTop < window.innerHeight && cardBottom > 0) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', animateCards);
    animateCards(); // Initial check on page load
});

// Utility functions
function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.innerHTML = isLoading ? 'Loading... <span class="spinner"></span>' : button.getAttribute('data-original-text');
}

function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-text') || 
        Object.assign(document.createElement('div'), {className: 'error-text'});
    errorDiv.textContent = message;
    if (!input.parentElement.querySelector('.error-text')) {
        input.parentElement.appendChild(errorDiv);
    }
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorDiv.id = `error-${input.id}`);
}

function clearError(input) {
    const errorDiv = input.parentElement.querySelector('.error-text');
    if (errorDiv) errorDiv.remove();
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
}

// Tab functionality
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function switchTab(activeTab, activeForm, inactiveTab, inactiveForm) {
    activeTab.classList.add('active');
    inactiveTab.classList.remove('active');
    activeForm.style.display = 'block';
    inactiveForm.style.display = 'none';
    activeTab.setAttribute('aria-selected', 'true');
    inactiveTab.setAttribute('aria-selected', 'false');
}

loginTab.addEventListener('click', () => switchTab(loginTab, loginForm, signupTab, signupForm));
signupTab.addEventListener('click', () => switchTab(signupTab, signupForm, loginTab, loginForm));

// Password strength validation
const signupPassword = document.getElementById('signupPassword');
const passwordStrength = signupPassword.parentElement.querySelector('.password-strength');

signupPassword.addEventListener('input', function() {
    const result = zxcvbn(this.value);
    let strength = '';
    let strengthClass = '';
    
    if (this.value === '') {
        passwordStrength.textContent = '';
        return;
    }

    switch(result.score) {
        case 0:
        case 1:
            strength = 'Weak password';
            strengthClass = 'weak';
            break;
        case 2:
            strength = 'Medium password';
            strengthClass = 'medium';
            break;
        case 3:
        case 4:
            strength = 'Strong password';
            strengthClass = 'strong';
            break;
    }

    passwordStrength.textContent = strength;
    passwordStrength.className = 'password-strength ' + strengthClass;
});

// Form validation and submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const loginButton = document.getElementById('loginButton');

    clearError(email);
    clearError(password);
    
    setLoading(loginButton, true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = getUser(email.value);
        if (!user || user.password !== password.value) {
            throw new Error('Invalid email or password');
        }

        if (rememberMe.checked) {
            localStorage.setItem('rememberedUser', email.value);
        }

        setCurrentUser(email.value);
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError(password, error.message);
    } finally {
        setLoading(loginButton, false);
    }
});

signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const signupButton = document.getElementById('signupButton');

    clearError(email);
    clearError(password);
    clearError(confirmPassword);

    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        return;
    }

    const passwordStrength = zxcvbn(password.value).score;
    if (passwordStrength < 2) {
        showError(password, 'Please choose a stronger password');
        return;
    }

    setLoading(signupButton, true);

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (getUser(email.value)) {
            throw new Error('Email already exists');
        }

        saveUser(email.value, password.value);
        setCurrentUser(email.value);
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError(email, error.message);
    } finally {
        setLoading(signupButton, false);
    }
});

// "Forgot Password" functionality
document.getElementById('forgotPasswordBtn').addEventListener('click', async function() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        showError(document.getElementById('loginEmail'), 'Please enter your email');
        return;
    }
    
    alert('If an account exists for ' + email + ', you will receive password reset instructions.');
});

// Remember Me functionality
window.addEventListener('load', function() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('loginEmail').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});

// Initialize button original text
document.querySelectorAll('.btn').forEach(btn => {
    btn.setAttribute('data-original-text', btn.innerHTML);
});

// Your existing utility functions
function saveUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[email] = { password: password };
    localStorage.setItem('users', JSON.stringify(users));
}

function getUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return users[email];
}

function setCurrentUser(email) {
    localStorage.setItem('currentUser', email);
}
(function() {
    emailjs.init("D07pQbW3_zYX8WYto");
})();

// Update the sendCodeBtn click handler to actually send an email
document.getElementById('sendCodeBtn').addEventListener('click', async function() {
    const resetEmail = document.getElementById('resetEmail');
    const sendCodeBtn = this;
    const resetAlert = document.getElementById('resetAlert');

    clearError(resetEmail);
    resetAlert.style.display = 'none';

    if (!resetEmail.value) {
        showError(resetEmail, 'Please enter your email');
        return;
    }

    const user = getUser(resetEmail.value);
    if (!user) {
        showError(resetEmail, 'No account found with this email');
        return;
    }

    setLoading(sendCodeBtn, true);

    try {
        // Generate a 6-digit code
        resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        currentResetEmail = resetEmail.value;

        // Send the email using EmailJS
        const templateParams = {
            to_email: currentResetEmail,
            reset_code: resetCode
        };

        await emailjs.send(
            "service_6dbewrb", // Replace with your EmailJS service ID
            "template_fm3w139", // Replace with your EmailJS template ID
            templateParams
        );

        resetAlert.className = 'alert alert-success';
        resetAlert.textContent = 'Reset code sent! Please check your email.';
        resetAlert.style.display = 'block';

        showResetStep('stepCode');
    } catch (error) {
        resetAlert.className = 'alert alert-error';
        resetAlert.textContent = 'Failed to send reset code. Please try again.';
        resetAlert.style.display = 'block';
        console.error('Failed to send email:', error);
    } finally {
        setLoading(sendCodeBtn, false);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // Dashboard specific functionality
    if (document.querySelector('.dashboard')) {
        // Logout button functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('You have been logged out.');
                // In a real application, you would handle the logout process here
                window.location.href = 'index.html';
            });
        }

        // Quiz start buttons
        const quizButtons = document.querySelectorAll('.quiz-card .btn');
        quizButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const quizTitle = e.target.closest('.quiz-card').querySelector('h3').textContent;
                alert(`Starting quiz: ${quizTitle}`);
                // In a real application, you would start the quiz here
            });
        });

        // Lesson continue buttons
        const lessonButtons = document.querySelectorAll('.lesson-card .btn');
        lessonButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lessonTitle = e.target.closest('.lesson-card').querySelector('h3').textContent;
                alert(`Continuing lesson: ${lessonTitle}`);
                // In a real application, you would continue the lesson here
            });
        });

        // Simulate loading of dynamic content
        setTimeout(() => {
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
        }, 300);
    }
});