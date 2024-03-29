let whitelist = [
    // catch ip
    "api.ipify.org",

    // google
    "gstatic.com",
    "googleapis.com",
    "doubleclick.net",
    "jnn-pa.googleapis.com",

    // yt
    "googlevideo.com",
    "youtube.com",
    "i.ytimg.com",

    // meta
    "facebook.com",
    "instagram.com",
    "threads.net"
];

// Map to store the VPN state per tab
let tabVPNState = {};

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const tabId = details.tabId;
        if (tabId !== -1) { // Exclude requests from the background script
            if (isInWhitelist(details.url)) {
                // console.log("URL: " + details.url);
                vpn(true, tabId);
            } else {
                vpn(false, tabId);
            }
        }else {
            vpn(false, tabId);
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.torEnabled !== undefined && sender.tab) {
        const tabId = sender.tab.id;
        vpn(!message.torEnabled, tabId); // Reverse the torEnabled flag
    }
});

function vpn(shouldEnable, tabId) {
    if (!tabVPNState.hasOwnProperty(tabId)) {
        tabVPNState[tabId] = false; // Default VPN state for the tab
    }

    chrome.storage.local.get('torEnabled', function(result) {
        const torEnabled = result.torEnabled || false; // Default value false if not set
        if (torEnabled && shouldEnable) {
            if (!tabVPNState[tabId]) {
                tabVPNState[tabId] = true;
                chrome.browserAction.setIcon({path: "../../img/vpn.png", tabId: tabId});
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
                }, function () {
                    console.log("Tor proxy enabled for tab: " + tabId);
                });
            }
        } else {
            if (tabVPNState[tabId] || !torEnabled){
                chrome.proxy.settings.clear({ scope: 'regular' }, function() {
                    // Disable Tor proxy
                    tabVPNState[tabId] = false;
                    console.log("Tor proxy disabled for tab: " + tabId);
                    chrome.browserAction.setIcon({ path: "../../img/vpn-off.png", tabId: tabId });
                });
            }
        }
    });
}

function isInWhitelist(url) {
    return whitelist.some(pattern => new RegExp(pattern).test(url));
}
