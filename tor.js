chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.torEnabled) {
        // Enable Tor proxy
        chrome.storage.local.get(['bypassList'], function(result) {
            const bypassList = result.bypassList || [];
            console.log(bypassList)
            chrome.proxy.settings.set({
                value: {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme: "socks5",
                            host: "127.0.0.1", // Tor proxy address
                            port: 9050 // Tor proxy port
                        },
                        bypassList: bypassList
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

