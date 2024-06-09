// Array of URL patterns to match for YouTube filtering
const youtubeFilters = [
    "*://*.youtube.com/*",
]

// Variable to store the function for blocking requests
let blockRequest

// Arrays to store filter data
let blockFilters = []

// Object to store blocked counts per tab
let blockedCountsPerTab = {};
// Object to store blocked URLs per tab
let blockedURLsPerTab = {};

// Function to increment the blocked count for a tab
function incrementBlockedCount(tabId) {
    if (!blockedCountsPerTab[tabId]) {
        blockedCountsPerTab[tabId] = 1;
    } else {
        blockedCountsPerTab[tabId]++;
    }
    // Update badge text for the tab
    chrome.browserAction.setBadgeText({text: blockedCountsPerTab[tabId].toString(), tabId: tabId});
}

// Function to reset the blocked count for a tab
function resetBlockedCount(tabId, reset) {
    if (reset){
        // Check if blockedCountsPerTab[tabId] is defined before accessing its value
        if (typeof blockedCountsPerTab[tabId] !== 'undefined') {
            blockedCountsPerTab[tabId] = 0;
        }
    }

    // Check if blockedCountsPerTab[tabId] is defined before setting the badge text
    if (typeof blockedCountsPerTab[tabId] !== 'undefined') {
        chrome.browserAction.setBadgeText({text: blockedCountsPerTab[tabId].toString(), tabId: tabId});
    }
}

// Function to reset the blocked URLs for a tab
function resetBlockedURLs(tabId, reset) {
    if (reset){
        blockedURLsPerTab[tabId] = [];
    }

    chrome.storage.local.set({"blockedURLs": blockedURLsPerTab[tabId]}, function () {
        console.log('Blocked URLs for tab ' + tabId + ' cleared.');
    });
}

// Function to store blocked URLs per tab
function storeBlockedURL(url, tabId) {
    if (!blockedURLsPerTab[tabId]) {
        blockedURLsPerTab[tabId] = [];
    }
    incrementBlockedCount(tabId);
    if (!blockedURLsPerTab[tabId].includes(url)) {
        blockedURLsPerTab[tabId].push(url);
        chrome.storage.local.set({"blockedURLs": blockedURLsPerTab[tabId]}, function () {
        });
    }
}

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
                details.url.includes("inline_preview.js") ||
                details.url.includes("intersection-observer.min.js") ||
                details.url.includes("custom-elements-es5-adapter.js") ||
                details.url.includes("annotations_module.js")
            ) {

                if (details.tabId != -1) {
                    // Store blocked URL
                    storeBlockedURL(details.url, details.tabId);
                }

                return {cancel: true};
            }
        },
        {urls: youtubeFilters}, // Matching URLs for YouTube
        ["blocking"] // Options
    );
}

// Function to block ads and trackers based on user-defined filters
function blockAdsAndTrackers() {
    if (blockFilters.length > 0) {
        console.log(blockFilters);
        // Define the block request function
        blockRequest = function (details) {
            if (details.tabId != -1) {
                // Store blocked URL
                storeBlockedURL(details.url, details.tabId);
            }
            return {cancel: true};
        };
        // Add listener to block requests
        chrome.webRequest.onBeforeRequest.addListener(
            blockRequest,
            {urls: blockFilters}, // Matching URLs for blocking
            ["blocking"] // Options
        );
    }
}

// Function to handle tab removal
chrome.tabs.onRemoved.addListener(function (tabId) {
    // Remove the tab's blocked count when the tab is closed
    delete blockedCountsPerTab[tabId];
    delete blockedURLsPerTab[tabId]
});

// Function to handle page reload/navigation
chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.transitionType === "reload" || details.transitionType === "typed") {
        resetBlockedCount(details.tabId, true);
        resetBlockedURLs(details.tabId, true);
    }
});

// Function to handle tab activation
chrome.tabs.onActivated.addListener(function(details) {
    // Reset the badge count and blocked URLs for the newly activated tab
    resetBlockedCount(details.tabId, false);
    resetBlockedURLs(details.tabId, false);
});

// Function to get filters from a JSON file
function getFiltersFromJson() {
    // Fetch blocklist JSON file
    fetch('../../blocklist.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each key-value pair in the data object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    chrome.storage.local.get([`${key}Filter`], function (result) {
                        if (result[`${key}Filter`]){
                            // console.log(key);
                            // Get the array of patterns for the current key
                            const patterns = data[key];
                            // Flatten the array of arrays
                            const flattenedPatterns = patterns.flat();
                            // Push each pattern into blockFilters
                            flattenedPatterns.forEach(pattern => {
                                // console.log(pattern);
                                blockFilters.push(pattern);
                            });
                        }
                    });
                }
            }
            // Call blockAdsAndTrackers after all patterns are pushed
            setTimeout(blockAdsAndTrackers, 100);
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}


// Define a function to handle changes in localStorage
function handleStorageChange() {
    blockFilters = []
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest)
    getFiltersFromJson()
}