// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line no-undef
window.addEventListener('DOMContentLoaded', () => {

    // node version
    const replaceText = (selector, text) => {
        // eslint-disable-next-line no-undef
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

    // add onclick event for connect button
    document.getElementById("btnConnect").addEventListener("click", connect);

    document.getElementById("btnWatcher").addEventListener("click", localwatcher);
    

})
