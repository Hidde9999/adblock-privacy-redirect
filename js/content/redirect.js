// Variable to store the best YouTube instance
let bestYoutubeSite

function iframeChange() {
    // Checking if YouTube redirection is enabled
    const youtubeRedirect = localStorage.getItem("youtubeRedirect")
    if (youtubeRedirect === "true") {
        // Get all iframes on the page
        const iframes = document.getElementsByTagName('iframe');

// Loop through each iframe
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];

            // Check if the src attribute contains "youtube.com"
            if (iframe.src.includes('youtube.com')) {
                // Replace the src with a new URL
                // For example, let's change it to "https://www.example.com"
                bestYoutubeInstance(iframe)
            }
        }
    }
}

if (document.readyState !== "loading") {
    iframeChange()
} else {
    document.addEventListener("DOMContentLoaded", iframeChange);
}

// Function to find the best YouTube instance
function bestYoutubeInstance(iframe) {
    // Fetching YouTube instances data
    fetch("https://api.invidious.io/instances.json?sort_by=type,health")
        .then(response => response.text())
        .then(jsonString => {
            jsonString = JSON.parse(jsonString)
            // Storing the best YouTube instance
            bestYoutubeSite = jsonString[0][0]
            iframe.src = iframe.src.replace('www.youtube.com', bestYoutubeSite);
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error)
        })
}