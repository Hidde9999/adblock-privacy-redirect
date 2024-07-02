const allowedCookies = [
    // roundcube
    "roundcube_sessid",
    "roundcube_sessauth",

    // euroclix
    "com.euroclix.login",
    "com.euroclix.hash",

    // hva
    "MSISAuth",

    // github
    "user_session",
    "logged_in"
];

const blockedCookies = [
    "lang",
    "timezone",
    "JSESSIONID",
];

// Domains to ignore
const ignoredDomains = [
    "chatgpt.com",
    "openai.com",
    "linkedin.com",
    "instagram.com",
    "x.com"
];

chrome.cookies.onChanged.addListener(function(changeInfo) {
    if (changeInfo.cause === "explicit" && !changeInfo.removed) {
        const cookie = changeInfo.cookie;

        // Check if the cookie is blocked
        if (blockedCookies.includes(cookie.name)) {
            handleNewCookie(cookie);
            return;
        }

        // Check if the cookie domain should be ignored
        for (const domain of ignoredDomains) {
            if (cookie.domain.includes(domain)) {
                return;
            }
        }

        // Handle other cookies
        handleNewCookie(cookie);
    }
});

function handleNewCookie(cookie) {
    // Log the cookie name
    console.log(cookie.name);

    // Check if the cookie is allowed
    if (allowedCookies.includes(cookie.name)) {
        return;
    }

    // Remove the cookie after a 5-second delay
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
    return `${protocol}//${cookie.domain}${cookie.path}`;
}
