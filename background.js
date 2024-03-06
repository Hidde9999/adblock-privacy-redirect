const youtubeFilters = [
    "*://*.youtube.com/",
    "*://*.youtube.com/watch?*",
    "*://*.youtube.com/@*",
];
const blockFilters = [
    "*://*.gstatic.com/*",
    "*://*.youtube.com/api/stats/*",
    // "*://*.youtube.com/oembed?*",
    // "*://*.youtube.com/generate_204",
    // "*://*.youtube.com/youtubei/*",
    // "*://googleads.g.doubleclick.net/*",
    "*://*.google.com/log?*",
    "*://*.googlesyndication.com/*",
    "*://*.googletagmanager.com/*",
    "*://*.doubleclick.net/*",
    "*://*.cdnst.net/javascript/ads/*",
    "*://*.cookielaw.org/*",
    // "*://*.2mdn.net/*",
    // "*://*.fastclick.net/*",
    // "*://*.jnn-pa.googleapis.com/*",
    "*://js.stripe.com/v3/fingerprinted/*",
    "*://api.odysee.com/membership/*",
    "*://watchman.na-backend.odysee.com/reports/*",
];
let bestYoutubeSite

window.onload = function () {
    bestYoutubeInstance()
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const youtubeRedirect = localStorage.getItem("youtubeRedirect");
        let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
        url = url.toString().replace("music.youtube.com", bestYoutubeSite)
        if (youtubeRedirect == "true"){
            return { redirectUrl: url };
        }
    },
    { urls: youtubeFilters },
    ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function() {
        return { cancel: true };
    },
    { urls: blockFilters },
    ["blocking"]
);

function bestYoutubeInstance(){
    fetch("https://api.invidious.io/instances.json?sort_by=type,health")
        .then(response => response.text())
        .then(jsonString => {
            jsonString = JSON.parse(jsonString)
            bestYoutubeSite = jsonString[0][0]
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error)
        })
}