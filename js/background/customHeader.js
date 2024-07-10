const os = [
    "Windows NT 10.0",
    "Windows NT 11.0",
    "Mac",
    "X11"
]

const os2 = [
    "Linux x86_64",
    "Win64",
    "Win32"
]

const browser = [
    "Firefox/126.0",
    "Chrome/126.0",
    "Safari/537.36",
]
const browser2 = [
    "Firefox/126.0",
    "Chrome/126.0",
    "Safari/537.36",
]



chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (
            details.url.includes("openai.com") ||
            details.url.includes("chatgpt.com") ||
            details.url.includes("challenges.cloudflare.com")
        ){
            return;
        }
        let refererSet = false;
        // console.log(details);
        for (let i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                let randomOS = os[Math.floor(Math.random() * os.length)];
                let randomOS2 = os2[Math.floor(Math.random() * os2.length)];
                let randomBrowser = browser[Math.floor(Math.random() * browser.length)];
                let randomBrowser2 = browser2[Math.floor(Math.random() * browser2.length)];

                details.requestHeaders[i].value = `${randomBrowser2} (${randomOS}; ${randomOS2}; rv:126.0) Gecko/20100101 ${randomBrowser}`;
            }
            if (details.requestHeaders[i].name === 'sec-ch-ua') {
                details.requestHeaders[i].value = 'Non of your businesses';
            }
            if (details.requestHeaders[i].name === 'sec-ch-ua-platform') {
                details.requestHeaders[i].value = 'Non of your businesses';
            }
            if (details.requestHeaders[i].name === 'Sec-Ch-Ua-Platform-Version') {
                details.requestHeaders[i].value = '0.0.0';
            }
            if (details.requestHeaders[i].name === 'X-Youtube-Time-Zone') {
                details.requestHeaders[i].value = 'Non of your businesses';
            }
            if (details.requestHeaders[i].name === 'X-Goog-Visitor-Id') {
                details.requestHeaders[i].value = 'Non of your businesses';
            }
        }
        // Add a custom header
        // details.requestHeaders.push({name: "X-Custom-Header", value: "CustomValue"});

        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
