// Array of URL patterns to match for YouTube filtering
const youtubeFilters = [
    "*://*.youtube.com/*",
];

// Variable to store the function for blocking requests
let blockRequest;

// Arrays to store filter data
let blockFilters = [];

// Object to store blocked counts per tab
let blockedCountsPerTab = {};

// Object to store blocked URLs per tab
let blockedURLsPerTab = {};

// Increment the blocked count for a tab and update the badge
function incrementBlockedCount(tabId) {
    blockedCountsPerTab[tabId] = (blockedCountsPerTab[tabId] || 0) + 1;
    updateBadgeText(tabId);
}

// Reset the blocked count for a tab and update the badge
function resetBlockedCount(tabId, reset) {
    if (reset && blockedCountsPerTab[tabId] !== undefined) {
        blockedCountsPerTab[tabId] = 0;
    }
    updateBadgeText(tabId);
}

// Update the badge text for a tab
function updateBadgeText(tabId) {
    if (blockedCountsPerTab[tabId] !== undefined) {
        chrome.browserAction.setBadgeText({ text: blockedCountsPerTab[tabId].toString(), tabId: tabId });
    }
}

// Reset the blocked URLs for a tab
function resetBlockedURLs(tabId, reset) {
    // Ensure blockedURLsPerTab exists
    if (!blockedURLsPerTab) {
        blockedURLsPerTab = {};
    }

    // Reset the blocked URLs for the specified tab if reset is true
    if (reset) {
        blockedURLsPerTab[tabId] = [];
    }

    // Get the URLs to store; either the ones from the tab or an empty array if none exist
    const urlsToStore = blockedURLsPerTab[tabId] || [];

    // Save the URLs to storage
    chrome.storage.local.set({ "blockedURLs": urlsToStore }, function () {
        console.log('Blocked URLs for tab ' + tabId + ' cleared.');
    });
}


// Store a blocked URL for a tab
function storeBlockedURL(url, tabId) {
    if (!blockedURLsPerTab[tabId]) {
        blockedURLsPerTab[tabId] = [];
    }
    if (!blockedURLsPerTab[tabId].includes(url)) {
        blockedURLsPerTab[tabId].push(url);
        chrome.storage.local.set({ "blockedURLs": blockedURLsPerTab[tabId] });
    }
    incrementBlockedCount(tabId);
}

// Block specific scripts on YouTube
function ytBlockScriptsByName() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const scriptsToBlock = [
                "sw.js", "scheduler.js", "spf.js", "network.js", "www-tampering.js",
                "web-animations-next-lite.min.js", "offline.js", "remote.js", "endscreen.js",
                "inline_preview.js", "intersection-observer.min.js", "custom-elements-es5-adapter.js",
                "annotations_module.js"
            ];
            if (scriptsToBlock.some(script => details.url.includes(script))) {
                if (details.tabId !== -1) {
                    storeBlockedURL(details.url, details.tabId);
                }
                return { cancel: true };
            }
        },
        { urls: youtubeFilters },
        ["blocking"]
    );
}

// Block ads and trackers based on user-defined filters
function blockAdsAndTrackers() {
    if (blockFilters.length > 0) {
        blockRequest = function (details) {
            if (details.tabId !== -1) {
                storeBlockedURL(details.url, details.tabId);
            }
            return { cancel: true };
        };
        chrome.webRequest.onBeforeRequest.addListener(
            blockRequest,
            { urls: blockFilters },
            ["blocking"]
        );
    }
}

// Handle tab removal
chrome.tabs.onRemoved.addListener(function (tabId) {
    delete blockedCountsPerTab[tabId];
    delete blockedURLsPerTab[tabId];

    resetBlockedURLs();
    resetBlockedCount();
});

// Handle page reload/navigation
chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.transitionType === "reload" || details.transitionType === "typed") {
        resetBlockedCount(details.tabId, true);
        resetBlockedURLs(details.tabId, true);
    }
});

// Handle tab activation
chrome.tabs.onActivated.addListener(function (details) {
    resetBlockedCount(details.tabId, false);
    resetBlockedURLs(details.tabId, false);
});

// Fetch filters from a JSON file
function getFiltersFromJson() {
    fetch(chrome.runtime.getURL('../json/blocklist.json'))
        .then(response => response.json())
        .then(data => {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    chrome.storage.local.get([`${key}Filter`], function (result) {
                        if (result[`${key}Filter`]) {
                            const patterns = data[key].flat();
                            blockFilters.push(...patterns);
                        }
                    });
                }
            }
            setTimeout(blockAdsAndTrackers, 100);
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

// Handle changes in localStorage
function handleStorageChange() {
    blockFilters = [];
    if (blockRequest) {
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
    }
    getFiltersFromJson();
}
