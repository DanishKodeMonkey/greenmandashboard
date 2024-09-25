// public/js/darkmode.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyDarkMode();
    } else {
        applyLightMode();
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.getAttribute('data-bs-theme') === 'dark';
        if (isDarkMode) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
    });

    function applyDarkMode() {
        body.setAttribute('data-bs-theme', 'dark');
        themeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
        console.log(localStorage.getItem('theme'));
    }

    function applyLightMode() {
        body.setAttribute('data-bs-theme', 'light');
        themeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
        console.log(localStorage.getItem('theme'));
    }
});
