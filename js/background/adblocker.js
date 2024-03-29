// Array of URL patterns to match for YouTube filtering
const youtubeFilters = [
    "*://*.youtube.com/*",
]

// Variable to store the function for blocking requests
let blockRequest

// Arrays to store filter data
let blockFilters = []
let blockFiltersObj = [] // Objects containing name and URL of filters
let blockFiltersNames = [] // Names of filters

// Function to block specific scripts on YouTube
function ytBlockScriptsByName() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            // Checking if the URL matches any of the script URLs to be blocked
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
                // Cancelling the request to block the script
                return {cancel: true};
            }
        },
        {urls: youtubeFilters}, // Matching URLs for YouTube
        ["blocking"] // Options
    )
}

// Function to block ads and trackers based on user-defined filters
function blockAdsAndTrackers() {
    if (blockFiltersObj.length > 0) {
        // Define the block request function
        blockRequest = function () {
            return {cancel: true}
        }
        // Add listener to block requests
        chrome.webRequest.onBeforeRequest.addListener(
            blockRequest,
            {urls: blockFilters}, // Matching URLs for blocking
            ["blocking"] // Options
        )
    }
}

// Function to get filters from storage or JSON file
function getFilters() {
    if (blockFiltersNames.length < 1) {
        getFiltersFromJson()
    } else {
        getFiltersFromStorage()
    }
}

// Function to get filters from local storage
function getFiltersFromStorage() {
    // Retrieve filter names and objects from local storage
    blockFiltersNames = JSON.parse(localStorage.getItem("filterNames"))
    blockFiltersObj = JSON.parse(localStorage.getItem("filterObj"))

    // Remove previous block request listener
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest)

    // Clear block filters array
    blockFilters = []

    // Iterate over each filter name
    blockFiltersNames.forEach(key => {
        // Check if the filter is toggled on
        const isToggled = localStorage.getItem(`${key}Filter`)

        if (isToggled === "true") {
            // Find objects with the same name and add their URLs to block filters
            const listBlocked = blockFiltersObj.filter(obj => obj.name === key)
            listBlocked.forEach(data => {
                blockFilters.push(data.url)
            })
        }
    })
    // Call the function to block ads and trackers with updated filters
    blockAdsAndTrackers()
}

// Function to get filters from a JSON file
function getFiltersFromJson() {
    // Fetch blocklist JSON file
    fetch('../../blocklist.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each key-value pair in the data object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    // Get the array of patterns for the current key
                    const patterns = data[key]
                    const isToggled = localStorage.getItem(`${key}Filter`)
                    blockFiltersNames.push(key)

                    if (isToggled === "true") {
                        // Log each pattern in the array
                        patterns.forEach(pattern => {
                            blockFiltersObj.push({name: key, url: pattern})
                            blockFilters.push(pattern)
                        })
                    }
                    // Call the function to block ads and trackers with updated filters
                    blockAdsAndTrackers()
                }
            }
            // Store filter names and objects in local storage
            localStorage.setItem("filterNames", JSON.stringify(blockFiltersNames))
            localStorage.setItem("filterObj", JSON.stringify(blockFiltersObj))
        })
        .catch(error => {
            console.error('Error fetching JSON:', error)
        })
}

// Define a function to handle changes in localStorage
function handleStorageChange(event) {
    // Check if the change is for a specific key related to filter toggles
    if (event.key.toString().includes("Filter")) {
        // Call the function to get filters from storage
        getFiltersFromStorage()
    }
}
