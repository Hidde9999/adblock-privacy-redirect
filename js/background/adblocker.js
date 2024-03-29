const youtubeFilters = [
    "*://*.youtube.com/*",
]

let blockRequest

let blockFilters = []
let blockFiltersObj = []
let blockFiltersNames = []

function ytBlockScriptsByName() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            if (
                details.url.includes("sw.js") ||
                details.url.includes("scheduler.js") ||
                details.url.includes("spf.js") ||
                details.url.includes("network.js") ||
                details.url.includes("www-tampering.js") ||
                details.url.includes("web-animations-next-lite.min.js") ||
                details.url.includes("offline.js") ||
                details.url.includes("remote.js") ||
                details.url.includes("endscreen.js") ||
                details.url.includes("inline_preview.js")
            ) {
                console.log(details.url);
                return {cancel: true};
            }
        },
        {urls: youtubeFilters},
        ["blocking"]
    )
}

function blockAdsAndTrackers() {
    if (blockFiltersObj.length > 0) {
        blockRequest = function () {
            return {cancel: true}
        }
        chrome.webRequest.onBeforeRequest.addListener(
            blockRequest,
            {urls: blockFilters},
            ["blocking"]
        )
    }
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
                    const isToogled = localStorage.getItem(`${key}Filter`)
                    blockFiltersNames.push(key)

                    if (isToogled === "true") {
                        // Log each pattern in the array
                        // console.log(`Patterns for ${key}:`)
                        patterns.forEach(pattern => {
                            blockFiltersObj.push({name: key, url: pattern})
                            blockFilters.push(pattern)
                        })
                    }
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