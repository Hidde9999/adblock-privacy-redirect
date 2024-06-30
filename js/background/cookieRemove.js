const allowedCookies = [
    // roundcube
    "roundcube_sessid",
    "roundcube_sessauth",

    // euroclix
    "com.euroclix.login",
    "com.euroclix.hash",

    // hva
    "MSISAuth",
]

const blockedCookies = [
    "lang",
    "timezone",
    "JSESSIONID",
]

chrome.cookies.onChanged.addListener(function(changeInfo) {
    if (changeInfo.cause === "explicit" && changeInfo.removed === false) {
        const cookie = changeInfo.cookie;

        if (blockedCookies.includes(cookie.name)){
            // console.log("hier "+ cookie.name);
            handleNewCookie(cookie);
            return
        } else if(
            cookie.domain.includes("chatgpt.com")   ||
            cookie.domain.includes("openai.com")    ||
            cookie.domain.includes("linkedin.com")  ||
            cookie.domain.includes("instagram.com") ||
            cookie.domain.includes("x.com")
        ){
            return;
        }

        handleNewCookie(cookie);
    }
});

function handleNewCookie(cookie) {
    console.log(cookie.name);
    if (allowedCookies.includes(cookie.name)){
        // console.log("allowed");
        return;
    }
    setTimeout(() => {
        chrome.cookies.remove({
            url: getCookieUrl(cookie),
            name: cookie.name
        }, function(details) {
            if (details) {
                console.log("Cookie removed:", details);
            } else {
                console.log("Failed to remove cookie:", cookie);
            }
        });
    }, 5000); // 5-second delay
}

function getCookieUrl(cookie) {
    // Construct the URL for the cookie
    const protocol = cookie.secure ? "https:" : "http:";
    return protocol + "//" + cookie.domain + cookie.path;
}