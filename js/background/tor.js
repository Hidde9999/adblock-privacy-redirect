let totalBypassList = [];

vpn()

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
            // Check if the URL matches any item in totalBypassList
            const isBypassed = totalBypassList.some(item => details.url.includes(item));
            let delay = 5000

            if (isBypassed) {
                // Disable Tor proxy
                chrome.proxy.settings.clear({scope: 'regular'}, function () {});
                setTimeout(vpn, delay);
            } else {
                // Call vpn() function with a timeout of 500ms
                setTimeout(vpn, 100);
            }
    },
    {urls: ["*://*/*"]},
    ["blocking"]
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.torEnabled) {
        vpn()
    } else {
        // Disable Tor proxy
        chrome.proxy.settings.clear({scope: 'regular'}, function () {});
    }
});

function vpn(){
    chrome.storage.local.get(['torEnabled'], function(result) {
        if (result.torEnabled){
            // Enable Tor proxy
                chrome.proxy.settings.set({
                    value: {
                        mode: "fixed_servers",
                        rules: {
                            singleProxy: {
                                scheme: "socks5",
                                host: "127.0.0.1",
                                port: 9050 // Default Tor port
                            }
                        }
                    },
                    scope: "regular"
                });
        }
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkOnlineStatus") {
        // console.log(navigator.onLine)
        sendResponse({ online: navigator.onLine });
    }
});


// Read and add URLs from JSON file to bypass list
fetch('../../bypass.json')
    .then(response => response.json())
    .then(data => {
        if (data && data.bypass && Array.isArray(data.bypass)) {
            totalBypassList = totalBypassList.concat(data.bypass); // Combine with bypass list from JSON
            // console.log(totalBypassList);
        }
        if (data && data.extra && Array.isArray(data.extra)) {
            totalBypassList = totalBypassList.concat(data.extra); // Combine with bypass list from JSON
            console.log(totalBypassList);
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));