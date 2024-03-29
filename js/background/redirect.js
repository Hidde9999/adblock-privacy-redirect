const redirectFilters = [
    "*://*.twitter.com/*",
    "*://www.google.com/*",
    "*://accounts.google.com/*",
    "*://*.gmail.com/*",
    "*://fonts.gstatic.com/*"
]
let bestYoutubeSite

function bestYoutubeInstance() {
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
function youtubeRedirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const youtubeRedirect = localStorage.getItem("youtubeRedirect")
            let url = details.url.toString().replace("www.youtube.com", bestYoutubeSite)
            url = url.toString().replace("music.youtube.com", bestYoutubeSite)
            if (youtubeRedirect === "true") {
                return {redirectUrl: url}
            }
        },
        {urls: youtubeFilters},
        ["blocking"]
    )
}

function redirectFunc() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {

            const redirectName = getRedirectName(details.url)

            const redirect = localStorage.getItem(`${redirectName}Redirect`)

            const url = getRedirectReplaceUrl(redirectName, details.url)

            if (!url.includes("/maps") && !url.includes("/recaptcha")) {
                if (redirect === "true") {
                    return {redirectUrl: url}
                }
            }
        },
        {urls: redirectFilters},
        ["blocking"]
    )
}

function getRedirectName(url) {
    let redirectName = url.replace(/^https?:\/\/(?:www\.|mail\.)?([^\/]+)(?:\/.*)?$/, "$1");
    redirectName = redirectName.replace(".com", "")
    redirectName = redirectName.replace("accounts.google.com", "gmail")
    redirectName = redirectName.replace(".gstatic", "")
    return redirectName
}

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