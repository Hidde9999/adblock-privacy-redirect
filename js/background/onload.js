window.onload = function () {
    bestYoutubeInstance()
    getFilters()
    redirectFunc()

    ytBlockScriptsByName()
    youtubeRedirectFunc()
    youtubeShortToVideoFunc()
    linkedinReplaceScriptsByName()

    // Add an event listener for the storage event
    window.addEventListener('storage', handleStorageChange)
}