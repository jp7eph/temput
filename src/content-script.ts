export { };

chrome.runtime.onMessage.addListener((request) => {
    console.debug(`[temput] receive message: ${request}`)
    if (document.activeElement == undefined) {
        return;
    }

    // TODO: Jiraの場合上手く貼り付けできない
    document.activeElement.innerHTML += request;
});
