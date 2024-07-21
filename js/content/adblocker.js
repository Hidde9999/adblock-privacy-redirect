const config = {
    "*": {  // Matches all URLs
        classes: ['fun-adsense'],
        ids: ['ad-id']
    },
    "https://jensen.nl/": {  // Matches specific URL pattern
        classes: ['sc-hAIpwP'],
        ids: ['example-ad-id']
    }
};

function blockAds() {
    const url = window.location.href;
    let blockConfig = config["*"];  // Default config for all URLs

    for (let pattern in config) {
        if (url.includes(pattern)){
                blockConfig = config[pattern];
                break;
        }
    }

    blockConfig.classes.forEach(className => {
        let elements = document.getElementsByClassName(className);
        console.log(elements);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    });

    blockConfig.ids.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    });
}
// blockAds();

// setInterval(blockAds, 2000);
// Initial Page Load
if (document.readyState !== "loading") {
    // console.log("Document is ready, fetching JSON data"); // Add logging here
    setInterval(blockAds, 500);
} else {
    // console.log("Document is not ready, adding event listener for DOMContentLoaded"); // Add logging here
    document.addEventListener("DOMContentLoaded", blockAds);
}
