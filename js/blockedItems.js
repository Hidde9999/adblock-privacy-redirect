// Function to fetch and display blocked URLs
function displayBlockedURLs() {
    chrome.storage.local.get("blockedURLs", function(result) {
        const blockedURLs = result.blockedURLs || [];
        const blockedList = document.getElementById("blockedList");

        // Clear previous list items
        blockedList.innerHTML = "";

        // Populate the list with blocked URLs
        blockedURLs.forEach(function(url) {
            const li = document.createElement("li");
            li.textContent = url;
            blockedList.appendChild(li);
        });
    });
}

// Call function when the popup is loaded
document.addEventListener("DOMContentLoaded", function() {
    displayBlockedURLs();
});
