let totalBypassList = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.torEnabled) {
        // Enable Tor proxy
        chrome.storage.local.get(['bypassList'], function(result) {
            const bypassList = result.bypassList || [];
            totalBypassList = bypassList.concat(totalBypassList); // Combine with existing bypass list

            chrome.proxy.settings.set({
                value: {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme: "socks5",
                            host: "127.0.0.1", // Tor proxy address
                            port: 9050 // Tor proxy port
                        },
                        bypassList: totalBypassList
                    }
                },
                scope: "regular"
            }, function() {});
        });
    } else {
        // Disable Tor proxy
        chrome.proxy.settings.clear({ scope: 'regular' }, function() {});
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
            // console.log(totalBypassList);
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));