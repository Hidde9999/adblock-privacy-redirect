const youtubeFilters = [
    "*://*.youtube.com/",
    "*://*.youtube.com/watch?*",
    "*://*.youtube.com/@*",
    "*://*.youtube.com/embed/*",
]
const redirectFilters = [
    "*://*.twitter.com/*",
    "*://www.google.com/*",
    "*://accounts.google.com/*",
    "*://*.gmail.com/*",
    "*://fonts.gstatic.com/*",
]
let blockRequest

let blockFilters = []
let blockFiltersObj = []
let blockFiltersNames = []
let bestYoutubeSite

window.onload = function () {
    bestYoutubeInstance()
    getFilters()
    youtubeRedirectFunc()
    redirectFunc()

    // Add an event listener for the storage event
    window.addEventListener('storage', handleStorageChange)
}

function youtubeRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const youtubeRedirect = localStorage.getItem("youtubeRedirect")
            let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
            url = url.toString().replace("music.youtube.com", bestYoutubeSite)
            if (youtubeRedirect === "true") {
                return {redirectUrl: url}
            }
        },
        {urls: youtubeFilters},
        ["blocking"]
    )
}

function redirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {

            const redirectName = getRedirectName(details.url)

            const redirect = localStorage.getItem(`${redirectName}Redirect`)

            const url = getRedirectReplaceUrl(redirectName, details.url)

            if (!url.includes("/maps") && !url.includes("/recaptcha")) {
                if (redirect === "true") {
                    return {redirectUrl: url}
                }
            }
        },
        {urls: redirectFilters},
        ["blocking"]
    )
}

function getRedirectName(url){
    let redirectName = url.replace(/^https?:\/\/(?:www\.|mail\.)?([^\/]+)(?:\/.*)?$/, "$1");
    redirectName = redirectName.replace(".com", "")
    redirectName = redirectName.replace("accounts.google.com", "gmail")
    redirectName = redirectName.replace(".gstatic", "")
    return redirectName
}
function getRedirectReplaceUrl(redirectName, url){
    url = url.toString().replace("twitter.com", "twiiit.com")
    url = url.toString().replace("www.google.com", "search.brave.com")

    if (redirectName == "fonts"){ url = replaceFonts(url) }

    if (redirectName == "gmail"){url = "https://account.proton.me/login"}
    return url
}

function replaceFonts(url){
    if (url.includes("/roboto/")){
        if (url.includes("KFOlCnqEu92Fr1MmEU9fBBc4")){
            url = chrome.extension.getURL("/fonts/roboto/KFOlCnqEu92Fr1MmEU9fBBc4.woff2");
        }
        if (url.includes("KFOlCnqEu92Fr1MmWUlfBBc4")){
            url = chrome.extension.getURL("/fonts/roboto/KFOlCnqEu92Fr1MmWUlfBBc4.woff2");
        }
        if (url.includes("KFOmCnqEu92Fr1Mu4mxK")){
            url = chrome.extension.getURL("/fonts/roboto/KFOmCnqEu92Fr1Mu4mxK.woff2");
        }
    }
    if (url.includes("/googlesans/")){
        url = chrome.extension.getURL("/fonts/googlesans/4UabrENHsxJlGDuGo1OIlLU94YtzCwY.woff2");
    }
    if (url.includes("/opensans/")){
        url = chrome.extension.getURL("/fonts/opensans/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2");
    }
    if (url.includes("HhyAU5Ak9u-oMExPeInvcuEmPosC9zSpYaEEU68cdvrHJvc8q9PLEJIz8dTgzBT9BLQV9eAKtpW99CIiY4Uzx5dFzRNFinsyGN7Ad_KqOtUz")){
        url = chrome.extension.getURL("/fonts/mapsfont.woff2");
    }
    return url
}

function blockAdsAndTrackers() {
    blockRequest = function () {
        return {cancel: true}
    }
    chrome.webRequest.onBeforeRequest.addListener(
        blockRequest,
        {urls: blockFilters},
        ["blocking"]
    )
}

function bestYoutubeInstance() {
    fetch("https://api.invidious.io/instances.json?sort_by=type,health")
        .then(response => response.text())
        .then(jsonString => {
            jsonString = JSON.parse(jsonString)
            bestYoutubeSite = jsonString[0][0]
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error)
        })
}

function getFilters() {
    if (blockFiltersNames.length < 1) {
        getFiltersFromJson()
    } else {
        getFiltersFromStorage()
    }
}

function getFiltersFromStorage() {
    blockFiltersNames = JSON.parse(localStorage.getItem("filterNames"))
    blockFiltersObj = JSON.parse(localStorage.getItem("filterObj"))

    chrome.webRequest.onBeforeRequest.removeListener(blockRequest)

    blockFilters = []

    blockFiltersNames.forEach(key => {
        const isToogled = localStorage.getItem(`${key}Filter`)

        if (isToogled === "true") {
            console.log(key);
            const listBlocked = blockFiltersObj.filter(obj => obj.name === key)
            listBlocked.forEach(data => {
                blockFilters.push(data.url)
            })
        }
    })
    blockAdsAndTrackers()
}

function getFiltersFromJson() {
    fetch('../../blocklist.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each key-value pair in the data object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    // Get the array of patterns for the current key
                    const patterns = data[key]

                    blockFiltersNames.push(key)

                    // Log each pattern in the array
                    console.log(`Patterns for ${key}:`)
                    patterns.forEach(pattern => {
                        blockFiltersObj.push({name: key, url: pattern})
                        blockFilters.push(pattern)
                    })
                    blockAdsAndTrackers()
                }
            }
            localStorage.setItem("filterNames", JSON.stringify(blockFiltersNames))
            localStorage.setItem("filterObj", JSON.stringify(blockFiltersObj))
        })
        .catch(error => {
            console.error('Error fetching JSON:', error)
        })
}

// Define a function to handle changes in localStorage
function handleStorageChange(event) {
    if (event.key.toString().includes("Filter")) { // Check if the change is for a specific key
        getFiltersFromStorage()
    }
}

// Read and add URLs from JSON file to bypass list
fetch('../../fakemedia.json')
    .then(response => response.json())
    .then(data => {
        if (data && data.news && Array.isArray(data.news)) {
            fakeMediaList = data.news; // Combine with bypass list from JSON
            // fakeMediaFunc()
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));