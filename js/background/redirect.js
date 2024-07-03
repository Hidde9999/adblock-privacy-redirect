// Array of URL patterns to match for redirection
// const redirectFilters = [
//     "*://accounts.google.com/*",
//     "*://*.gmail.com/*",
//     "*://fonts.gstatic.com/*"
// ]

const replaceScriptsFilters = [
    "*://code.jquery.com/*",
    "*://use.fontawesome.com/*",
    "*://stackpath.bootstrapcdn.com/*",
    "*://cdn.jsdelivr.net/*"
]

const replaceFontsFilters = [
    "*://fonts.gstatic.com/*",
]

const googleRedirectFilters = [
    "*://www.google.com/*",
]
const twitterRedirectFilters = [
    "*://x.com/*",
    "*://twitter.com/*",
]

const youtubeRedirectFilters = [
    "*://*.youtube.com/",
    "*://*.youtube.com/embed/*",
    "*://*.youtube.com/@*",
    "*://*.youtube.com/watch?*",
    "*://*.youtube.com/results?*",
    "*://*.youtube.com/channel/*",
]

const youtubeShortFilters = [
    "*://www.youtube.com/shorts/*",
]

let bestYoutubeSite = "invidious.privacyredirect.com"

let youtubeRedirect
let googleRedirect
let twitterRedirect

function loadRedirectSettings() {
    chrome.storage.local.get(["toggleSwitchYT", "toggleSwitchGoogle", "toggleSwitchTwitter"], function (result) {
        youtubeRedirect = result["toggleSwitchYT"];
        googleRedirect = result["toggleSwitchGoogle"];
        twitterRedirect = result["toggleSwitchTwitter"];
    });
}

// Function to handle YouTube redirection
function youtubeRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            // Replacing YouTube URLs with the best instance URL
            let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
            url = url.toString().replace("music.youtube.com", bestYoutubeSite)
            if (youtubeRedirect && !url.includes("/search?query=")) {
                return {redirectUrl: url}
            }
        },
        {urls: youtubeRedirectFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

// Function to handle YouTube redirection
function youtubeShortToVideoFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const url = details.url.toString().replace("shorts/", "watch?v=")
            return {redirectUrl: url}
        },
        {urls: youtubeShortFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

function googleRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            let url = details.url.toString().replace("www.google.com", "search.brave.com")

            if (googleRedirect) {
                return {redirectUrl: url}
            }
        },
        {urls: googleRedirectFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

function twitterRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            console.log(details.url);
            let url = details.url.toString().replace("x.com", "twiiit.com")

            if (twitterRedirect) {
                return {redirectUrl: url}
            }
        },
        {urls: twitterRedirectFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

// Function to replace font URLs with local URLs
function replaceFonts() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            let url = details.url
            // console.log(details.url);
            if (url.includes("/roboto/")) {
                if (url.includes("KFOlCnqEu92Fr1MmEU9fBBc4")) {
                    url = chrome.extension.getURL("/fonts/roboto/KFOlCnqEu92Fr1MmEU9fBBc4.woff2");
                }
                if (url.includes("KFOlCnqEu92Fr1MmWUlfBBc4")) {
                    url = chrome.extension.getURL("/fonts/roboto/KFOlCnqEu92Fr1MmWUlfBBc4.woff2");
                }
                if (url.includes("KFOmCnqEu92Fr1Mu4mxK")) {
                    url = chrome.extension.getURL("/fonts/roboto/KFOmCnqEu92Fr1Mu4mxK.woff2");
                }
                if (url.includes("KFOkCnqEu92Fr1Mu51xIIzI")) {
                    url = chrome.extension.getURL("/fonts/roboto/KFOkCnqEu92Fr1Mu51xIIzI.woff2");
                }
            }
            if (url.includes("/poppins/")) {
                if (url.includes("pxiEyp8kv8JHgFVrJJfecg")) {
                    url = chrome.extension.getURL("/fonts/poppins/pxiEyp8kv8JHgFVrJJfecg.woff2");
                }
                if (url.includes("pxiByp8kv8JHgFVrLCz7Z1xlFQ")) {
                    url = chrome.extension.getURL("/fonts/poppins/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2");
                }
                if (url.includes("pxiByp8kv8JHgFVrLEj6Z1xlFQ")) {
                    url = chrome.extension.getURL("/fonts/poppins/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2");
                }
            }
            if (url.includes("/ubuntu/")) {
                if (url.includes("4iCp6KVjbNBYlgoKejZPslyPN4E")) {
                    url = chrome.extension.getURL("/fonts/ubuntu/4iCp6KVjbNBYlgoKejZPslyPN4E.woff2");
                }
                if (url.includes("4iCs6KVjbNBYlgoKfw72")) {
                    url = chrome.extension.getURL("/fonts/ubuntu/4iCs6KVjbNBYlgoKfw72.woff2");
                }
                if (url.includes("4iCv6KVjbNBYlgoCjC3jsGyN")) {
                    url = chrome.extension.getURL("/fonts/ubuntu/4iCv6KVjbNBYlgoCjC3jsGyN.woff2");
                }
                if (url.includes("4iCv6KVjbNBYlgoCxCvjsGyN")) {
                    url = chrome.extension.getURL("/fonts/ubuntu/4iCv6KVjbNBYlgoCxCvjsGyN.woff2");
                }
            }
            if (url.includes("/googlesans/")) {
                url = chrome.extension.getURL("/fonts/googlesans/4UabrENHsxJlGDuGo1OIlLU94YtzCwY.woff2");
            }
            if (url.includes("/youtubesans/")) {
                url = chrome.extension.getURL("/fonts/youtubesans/Qw38ZQNGEDjaO2m6tqIqX5E-AVS5_rSejo46_PCTRspJ0OosolrBEJL3HO_T7fE.woff2");
            }
            if (url.includes("/opensans/")) {
                url = chrome.extension.getURL("/fonts/opensans/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2");
            }
            if (url.includes("HhyAU5Ak9u-oMExPeInvcuEmPosC9zSpYaEEU68cdvrHJvc8q9PLEJIz8dTgzBT9BLQV9eAKtpW99CIiY4Uzx5dFzRNFinsyGN7Ad_KqOtUz")) {
                url = chrome.extension.getURL("/fonts/mapsfont.woff2");
            }

            return {redirectUrl: url}
        },
        {urls: replaceFontsFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

function replaceScripts() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            let url = details.url
            // console.log(details.url);
            if (details.url.includes("jquery-3.6.0.min.js")) {
                url = chrome.extension.getURL("/js/replaceJS/jquery-3.6.0.min.js");
            }
            if (details.url.includes("jquery.min.js")) {
                url = chrome.extension.getURL("/js/replaceJS/jquery.min.js");
            }
            if (details.url.includes("/css/all.css")) {
                url = chrome.extension.getURL("/js/replaceJS/fontawesome.css");
            }
            if (details.url.includes("/css/bootstrap.min.css")) {
                url = chrome.extension.getURL("/js/replaceJS/bootstrap.min.css");
            }
            if (details.url.includes("/js/bootstrap.bundle.min.js")) {
                url = chrome.extension.getURL("/js/replaceJS/bootstrap.bundle.min.js");
            }
            if (details.url.includes("/dist/axios.min.js")) {
                url = chrome.extension.getURL("/js/replaceJS/axios.min.js");
            }

            return {redirectUrl: url}
        },
        {urls: replaceScriptsFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}