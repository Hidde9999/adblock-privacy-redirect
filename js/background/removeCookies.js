let isCleaningEnabled = false;
let cleanupIntervalId;

chrome.runtime.onInstalled.addListener(function() {
    // Set the default value of isCleaningEnabled to false
    chrome.storage.local.set({ "isCleaningEnabled": isCleaningEnabled });

    // Check if cleaning is enabled
    chrome.storage.local.get("isCleaningEnabled", function(data) {
        isCleaningEnabled = data.isCleaningEnabled;
        if (isCleaningEnabled) {
            startCleaning();
        }
    });
});

function startCleaning() {
    // Set the time interval for cookie cleanup (in milliseconds)
    const cleanupInterval = 3600000; // 1 hour (adjust as needed)

    // Schedule the cookie cleanup function
    cleanupIntervalId = setInterval(cleanCookies, cleanupInterval);
}

function cleanCookies() {
    console.log("clean...")
    // Get all cookies and remove them
    chrome.cookies.getAll({}, function(cookies) {
        for (let i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({
                "url": "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path,
                "name": cookies[i].name
            });
        }
    });

    // Send status update to the popup
    chrome.runtime.sendMessage({ status: "Cleaning in progress..." });
}

function toggleCleaning() {
    isCleaningEnabled = !isCleaningEnabled;
    chrome.storage.local.set({ "isCleaningEnabled": isCleaningEnabled });

    if (isCleaningEnabled) {
        startCleaning();
    } else {
        clearInterval(cleanupIntervalId);
    }

    const status = isCleaningEnabled ? "Cleaning enabled." : "Cleaning disabled.";
    chrome.runtime.sendMessage({ status: status });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.toggleCleaning) {
        toggleCleaning();
    } else if (request.cleanNow) {
        cleanCookies();
    }
});
