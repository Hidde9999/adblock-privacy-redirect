const os = [
    "Windows NT 10.0",
    "Macintosh; Intel Mac OS X 10_11_2",
    "Linux; x86_64",
    "X11; Linux x86_64"
];

const browser = [
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Gecko/20100101 Firefox/128.0"
];

// Select random OS and browser
let randomOS = os[Math.floor(Math.random() * os.length)];
let randomBrowser = browser[Math.floor(Math.random() * browser.length)];

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.url.includes("challenges.cloudflare.com")) {
            return;
        }

        for (let i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                // Construct the User-Agent string
                details.requestHeaders[i].value = `Mozilla/128.0 (${randomOS}) ${randomBrowser}`;
            }
            if (details.requestHeaders[i].name === 'sec-ch-ua') {
                details.requestHeaders[i].value = 'Non of your business';
            }
            if (details.requestHeaders[i].name === 'sec-ch-ua-platform') {
                details.requestHeaders[i].value = 'Non of your business';
            }
            if (details.requestHeaders[i].name === 'Sec-Ch-Ua-Platform-Version') {
                details.requestHeaders[i].value = '0.0.0';
            }
            if (details.requestHeaders[i].name === 'X-Youtube-Time-Zone') {
                details.requestHeaders[i].value = 'Non of your business';
            }
            if (details.requestHeaders[i].name === 'X-Goog-Visitor-Id') {
                details.requestHeaders[i].value = 'Non of your business';
            }
        }

        return {requestHeaders: details.requestHeaders};
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);
