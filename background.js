const youtubeFilters = [
    "*://*.youtube.com/",
    "*://*.youtube.com/watch?*",
    "*://*.youtube.com/@*",
];
const twitterFilters = [
    "*://*.twitter.com/*",
];
const blockFilters = [];
let bestYoutubeSite

window.onload = function () {
    bestYoutubeInstance()
    getFilters()
    youtubeRedirectFunc()
    twitterRedirectFunc()
}

function youtubeRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const youtubeRedirect = localStorage.getItem("youtubeRedirect")
            let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
            url = url.toString().replace("music.youtube.com", bestYoutubeSite)
            if (youtubeRedirect == "true") {
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

            if (twitterRedirect == "true") {
                return {redirectUrl: url}
            }
        },
        {urls: twitterFilters},
        ["blocking"]
    )
}

function blockAdsAndTrackers() {
    chrome.webRequest.onBeforeRequest.addListener(
        function () {
            return {cancel: true}
        },
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
    // Assuming your JSON file is named "patterns.json"
    fetch('blocklist.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each key-value pair in the data object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    // Get the array of patterns for the current key
                    const patterns = data[key]

                    // Log each pattern in the array
                    console.log(`Patterns for ${key}:`)
                    patterns.forEach(pattern => {
                        blockFilters.push(pattern)
                    });
                    blockAdsAndTrackers()
                }
            }
        })
        .catch(error => {
            console.error('Error fetching JSON:', error)
        })
}