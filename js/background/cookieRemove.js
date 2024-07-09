const allowedCookies = [{
    domain: null,
    cookies: [
        "roundcube_sessid",
        "roundcube_sessauth",
    ],
}, {
    domain: null,
    cookies: ["MSISAuth"],
}, {
    domain: "github.com",
    cookies: [
        "user_session",
        "logged_in"
    ],
}, {
    domain: "euroclix.nl",
    cookies: [
        "com.euroclix.login",
        "com.euroclix.hash",
        "ECX_COOKIE_CONSENT",
    ]
},{
    domain: "chatgpt.com",
    cookies: ["*"]
},{
    domain: "openai.com",
    cookies: ["*"]
},{
    domain: "proton.me",
    cookies: ["*"]
}
];

chrome.cookies.onChanged.addListener(function (changeInfo) {
    if (changeInfo.cause === "explicit" && !changeInfo.removed) {
        const cookie = changeInfo.cookie;

        // Handle other cookies
        handleNewCookie(cookie);
    }
});

function handleNewCookie(cookie) {
    // Check if the cookie is in the allowedCookies list
    if (!isAllowedCookie(cookie)) {
        // Remove the cookie after a 5-second delay
        setTimeout(() => {
            chrome.cookies.remove({
                url: getCookieUrl(cookie),
                name: cookie.name
            }, function (details) {
                if (details) {
                    console.log("Cookie removed:", details);
                } else {
                    console.log("Failed to remove cookie:", cookie);
                }
            });
        }, 10000); // 10-second delay
    } else {
        // console.log(cookie + " Allowed")
    }
}

function isAllowedCookie(cookie) {
    return allowedCookies.some(allowedCookie => {
        const domainMatch = allowedCookie.domain === null || cookie.domain.endsWith(allowedCookie.domain);
        const nameMatch =  allowedCookie.cookies.includes("*") || allowedCookie.cookies.includes(cookie.name);
        return domainMatch && nameMatch;
    });
}

function getCookieUrl(cookie) {
    // Construct the URL for the cookie
    const protocol = cookie.secure ? "https:" : "http:";
    return `${protocol}//${cookie.domain}${cookie.path}`;
}