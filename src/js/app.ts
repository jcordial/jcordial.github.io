console.log('test');

function setTheme(dark: boolean) {
    const [add, remove] = dark ? ["dark", 'light'] : ["light", 'dark'];
    document.documentElement.classList.replace(remove,add);
}
const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
setTheme(mediaQueryList.matches);
mediaQueryList.addEventListener('change', e => {
    setTheme(e.matches);
});

