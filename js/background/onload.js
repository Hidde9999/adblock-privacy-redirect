window.onload = function () {
    bestYoutubeInstance()
    getFilters()
    youtubeRedirectFunc()
    redirectFunc()

    ytBlockScriptsByName()

    // Add an event listener for the storage event
    window.addEventListener('storage', handleStorageChange)
}