// Array of URL patterns to match for redirection
const redirectFilters = [
    "*://*.twitter.com/*",
    "*://www.google.com/*",
    "*://accounts.google.com/*",
    "*://*.gmail.com/*",
    "*://fonts.gstatic.com/*"
]
// Array of URL patterns to match for YouTube filtering
const youtubeShortFilters = [
    "*://www.youtube.com/shorts/*",
]

// Variable to store the best YouTube instance
let bestYoutubeSite = "invidious.fdn.fr"

// Function to find the best YouTube instance
function bestYoutubeInstance() {
    // Fetching YouTube instances data
    // fetch("https://api.invidious.io/instances.json?sort_by=type,health")
    //     .then(response => response.text())
    //     .then(jsonString => {
    //         jsonString = JSON.parse(jsonString)
    //         // Storing the best YouTube instance
    //         bestYoutubeSite = jsonString[0][0]
    //     })
    //     .catch(error => {
    //         console.error('Error fetching RSS feed:', error)
    //     })
}

// Function to handle YouTube redirection
function youtubeRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            // Checking if YouTube redirection is enabled
            const youtubeRedirect = localStorage.getItem("youtubeRedirect")
            // Replacing YouTube URLs with the best instance URL
            let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
            url = url.toString().replace("music.youtube.com", bestYoutubeSite)
            if (youtubeRedirect === "true") {
                return {redirectUrl: url}
            }
        },
        {urls: youtubeFilters}, // Matching URLs for redirection
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

// Function to handle general redirection
function redirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            // Getting the name of the redirect from the URL
            const redirectName = getRedirectName(details.url)
            // Checking if redirection is enabled for this specific site
            const redirect = localStorage.getItem(`${redirectName}Redirect`)
            // Getting the replacement URL for redirection
            const url = getRedirectReplaceUrl(redirectName, details.url)
            // Avoiding redirection for specific URLs
            if (!url.includes("/maps") && !url.includes("/recaptcha")) {
                if (redirect === "true") {
                    return {redirectUrl: url}
                }
            }
        },
        {urls: redirectFilters}, // Matching URLs for redirection
        ["blocking"] // Options
    )
}

// Function to extract the name of the site from the URL
function getRedirectName(url) {
    let redirectName = url.replace(/^https?:\/\/(?:www\.|mail\.)?([^\/]+)(?:\/.*)?$/, "$1");
    redirectName = redirectName.replace(".com", "")
    redirectName = redirectName.replace("accounts.google.com", "gmail")
    redirectName = redirectName.replace(".gstatic", "")
    return redirectName
}

// Function to get the replacement URL for redirection
function getRedirectReplaceUrl(redirectName, url) {
    url = url.toString().replace("twitter.com", "twiiit.com")
    url = url.toString().replace("www.google.com", "search.brave.com")

    if (redirectName == "fonts") {
        url = replaceFonts(url)
    }

    if (redirectName == "gmail") {
        url = "https://account.proton.me/login"
    }
    return url
}

// Function to replace font URLs with local URLs
function replaceFonts(url) {
    console.log(url);
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
    }
    if (url.includes("/googlesans/")) {
        url = chrome.extension.getURL("/fonts/googlesans/4UabrENHsxJlGDuGo1OIlLU94YtzCwY.woff2");
    }
    if (url.includes("/opensans/")) {
        url = chrome.extension.getURL("/fonts/opensans/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2");
    }
    if (url.includes("HhyAU5Ak9u-oMExPeInvcuEmPosC9zSpYaEEU68cdvrHJvc8q9PLEJIz8dTgzBT9BLQV9eAKtpW99CIiY4Uzx5dFzRNFinsyGN7Ad_KqOtUz")) {
        url = chrome.extension.getURL("/fonts/mapsfont.woff2");
    }
    return url
}