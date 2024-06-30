window.onload = function () {
    // getFilters()
    getFiltersFromJson()
    ytBlockScriptsByName()

    loadRedirectSettings()
    youtubeRedirectFunc()
    youtubeShortToVideoFunc()
    googleRedirectFunc()
    twitterRedirectFunc()

    // todo: make it toggleable
    replaceFonts()
    replaceScripts()

    // Add an event listener for the storage event
    // window.addEventListener('storage', handleStorageChange)

// Listen for changes in the storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key.includes("Filter")){
                handleStorageChange()
            } else {
                loadRedirectSettings()
            }
            // console.log(
            //     `Storage key "${key}" in namespace "${namespace}" changed.`,
            //     `Old value was "${oldValue}", new value is "${newValue}".`
            // );
        }
    });
}