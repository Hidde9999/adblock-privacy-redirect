let totalBypassList = [];

vpn()

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
            const isBypassed = totalBypassList.some(item => details.url.includes(item));
            let delay = 5000

            if (isBypassed) {
                // Disable Tor proxy
                chrome.proxy.settings.clear({scope: 'regular'}, function () {});
                setTimeout(vpn, delay);
            } else {
                setTimeout(vpn, delay);
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
            chrome.browserAction.setIcon({ path: "../../img/vpn.png" });
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
        } else {
            chrome.browserAction.setIcon({ path: "../../img/vpn-off.png" }); // Set the icon for VPN OFF
        }
    })
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "checkOnlineStatus") {
//         sendResponse({ online: navigator.onLine });
//     }
// });

// Read and add URLs from JSON file to bypass list
fetch('../../bypass.json')
    .then(response => response.json())
    .then(data => {
        if (data && data.bypass && Array.isArray(data.bypass)) {
            totalBypassList = totalBypassList.concat(data.bypass); // Combine with bypass list from JSON
        }
        if (data && data.extra && Array.isArray(data.extra)) {
            totalBypassList = totalBypassList.concat(data.extra); // Combine with bypass list from JSON
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));