export { };

chrome.runtime.onMessage.addListener((request) => {
    console.debug(`[temput] receive message: ${request}`)
    if (document.activeElement == undefined) {
        return;
    }

    document.activeElement.innerHTML += request;
});
