document.addEventListener("DOMContentLoaded", function() {
    const cleaningToggle = document.getElementById("cleaningToggle");
    const statusDisplay = document.getElementById("status");
    const cleanNowButton = document.getElementById("cleanNow");

    // Load status on load
    chrome.runtime.sendMessage({ getStatus: true }, function(response) {
        if (response.status) {
            statusDisplay.textContent = response.status;
        }
    });

    // Retrieve the current toggle state and update the checkbox
    chrome.storage.local.get("isCleaningEnabled", function(data) {
        cleaningToggle.checked = data.isCleaningEnabled;
    });

    // Listen for changes in the checkbox and send a message to the background script to toggle cleaning
    cleaningToggle.addEventListener("change", function() {
        chrome.runtime.sendMessage({ toggleCleaning: cleaningToggle.checked });
    });

    // Listen for changes in the toggle state from the background script and update the checkbox
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (changes.hasOwnProperty("isCleaningEnabled")) {
            cleaningToggle.checked = changes.isCleaningEnabled.newValue;
        }
    });

    // Listen for clicks on the "Clean Now" button and send a message to the background script to clean cookies
    cleanNowButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ cleanNow: true });
    });

    // Listen for messages from the background script to update the status display
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.hasOwnProperty("status")) {
            statusDisplay.textContent = message.status;
        }
    });
});

