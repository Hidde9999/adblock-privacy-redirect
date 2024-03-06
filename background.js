const youtubeFilters = [
    "*://*.youtube.com/",
    "*://*.youtube.com/watch?*",
    "*://*.youtube.com/@*",
]
const twitterFilters = [
    "*://*.twitter.com/*",
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
    twitterRedirectFunc()

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

function twitterRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const twitterRedirect = localStorage.getItem("twitterRedirect")
            let url = details.url.toString().replace("twitter.com", "twiiit.com")

            if (twitterRedirect === "true") {
                return {redirectUrl: url}
            }
        },
        {urls: twitterFilters},
        ["blocking"]
    )
}

function blockAdsAndTrackers() {
    blockRequest = function () {
        //Instructions
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
    const filterNames = localStorage.getItem("filterNames")

    if (!filterNames) {
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
            const listBlocked = blockFiltersObj.filter(obj => obj.name === key)
            listBlocked.forEach(data => {
                blockFilters.push(data.url)
            })
        }
    })
    blockAdsAndTrackers()
}

function getFiltersFromJson() {
    // Assuming your JSON file is named "patterns.json"
    fetch('blocklist.json')
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