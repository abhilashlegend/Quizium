let inactivityTimer;

export function startAutoLogout(submit) {

    const resetTimer = () => {

        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(() => {
            submit(null, { method: 'POST', action: '/logout' });
        }, 60 * 60 * 1000); // 1 hour inactivity
    };

    // events that count as user activity
    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer(); // start timer immediately
}