// Function to fetch and display blocked URLs
function displayBlockedURLs() {
    chrome.storage.local.get("blockedURLs", function(result) {
        const blockedURLs = result.blockedURLs || [];
        const blockedList = document.getElementById("blockedList");

        // Clear previous list items
        blockedList.innerHTML = "";

        // Create a dictionary to count occurrences of each URL
        const urlCounts = blockedURLs.reduce((counts, url) => {
            counts[url] = (counts[url] || 0) + 1;
            return counts;
        }, {});

        // Populate the list with blocked URLs and their counts
        Object.entries(urlCounts).forEach(([url, count]) => {
            const li = document.createElement("li");
            li.textContent = `${url} (${count})`;
            blockedList.appendChild(li);
        });
    });
}

// Call function when the popup is loaded
document.addEventListener("DOMContentLoaded", function() {
    displayBlockedURLs();
});

