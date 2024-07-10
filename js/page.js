document.addEventListener('DOMContentLoaded', function() {
    // Query the active tab to get its URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // tabs is an array of tabs that match the query parameters
        if (tabs.length > 0) {
            const currentTab = tabs[0];
            const url = currentTab.url;
            if (url.includes("youtube.com") || url.includes("invidious.privacyredirect.com")) {
                window.location = "youtube.html"
            } else {
                window.location = "home.html"
            }
        }
    });
});

