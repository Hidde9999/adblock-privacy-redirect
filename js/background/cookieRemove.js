let allowedCookies = [];

fetch(chrome.runtime.getURL("json/cookies.json"))
    .then(response => response.json())
    .then(data => {
        allowedCookies = data;
        console.log("Allowed cookies loaded:", allowedCookies);
    })
    .catch(error => console.error('Error loading allowed cookies:', error));

// Convert the async storage get call to a promise-based function
function getGoogleCookies() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["googleCookies"], function (result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result["googleCookies"]);
        });
    });
}
// Convert the async storage get call to a promise-based function
function getInstaCookies() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["instaCookies"], function (result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result["instaCookies"]);
        });
    });
}

async function isAllowedCookie(cookie) {
    // Check if the cookie domain is google.com and googleCookies is set
    try {
        const googleCookies = await getGoogleCookies();
        const instaCookies = await getInstaCookies();
        if (googleCookies && (cookie.domain.includes('google.com') || cookie.domain.includes('youtube.com'))) {
            return true;
        }
        if (instaCookies && cookie.domain.includes('instagram.com')) {
            return true;
        }
    } catch (error) {
        console.error('Error accessing storage:', error);
    }

    // Check if the cookie is in the allowedCookies list
    return allowedCookies.some(allowedCookie => {
        const domainMatch = allowedCookie.domain === null || cookie.domain.endsWith(allowedCookie.domain);
        const nameMatch = allowedCookie.cookies.includes("*") || allowedCookie.cookies.includes(cookie.name);
        return domainMatch && nameMatch;
    });
}

// Modify handleNewCookie to handle asynchronous isAllowedCookie check
function handleNewCookie(cookie) {
    // console.log("hier")
    chrome.storage.local.get(["autoCookies"], function (result) {
        if (!result["autoCookies"]) {
            console.log("autoCookies is turned off!");
            return;
        }
        isAllowedCookie(cookie).then(isAllowed => {
            if (!isAllowed) {
                // Remove the cookie after a 10-second delay
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
        });
    })
}

function getCookieUrl(cookie) {
    // Construct the URL for the cookie
    const protocol = cookie.secure ? "https:" : "http:";
    return `${protocol}//${cookie.domain}${cookie.path}`;
}

chrome.cookies.onChanged.addListener(function (changeInfo) {
    // console.log("hoi")
    if (changeInfo.cause === "explicit" && !changeInfo.removed) {
        const cookie = changeInfo.cookie;

        // Handle other cookies
        handleNewCookie(cookie);
    }
});

