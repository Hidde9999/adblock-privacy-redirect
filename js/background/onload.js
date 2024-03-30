window.onload = function () {
    bestYoutubeInstance()
    getFilters()
    redirectFunc()

    ytBlockScriptsByName()
    youtubeRedirectFunc()
    youtubeShortToVideoFunc()

    // Add an event listener for the storage event
    window.addEventListener('storage', handleStorageChange)
}