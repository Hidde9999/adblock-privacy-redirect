let totalBypassList = [];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.torEnabled) {
        // Enable Tor proxy
        chrome.storage.local.get(['bypassList'], function(result) {
            const bypassList = result.bypassList || [];
            totalBypassList += bypassList
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
fetch('bypass.json')
    .then(response => response.json())
    .then(data => {
        if (data && data.bypass && Array.isArray(data.bypass)) {
            data.bypass.forEach(url => {
                totalBypassList.push(url);
            });
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));