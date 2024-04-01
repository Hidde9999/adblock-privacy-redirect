// Array containing URLs to whitelist, i.e., URLs that should not be routed through the VPN
let whitelist = [
    // catch ip
    "api.ipify.org",

    // google
    "gstatic.com",
    "googleapis.com",
    "doubleclick.net",
    "jnn-pa.googleapis.com",
    "google.com/recaptcha/",

    // yt
    ".googlevideo.com/videoplayback",
    "youtube.com",
    // "i.ytimg.com",

    // meta
    "facebook.com",
    "instagram.com",
    "threads.net"
];

// Map to store the VPN state per tab
let tabVPNState = {};

// Listener to handle web requests before they are made
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const tabId = details.tabId;
        if (tabId !== -1) { // Exclude requests from the background script
            if (isInWhitelist(details.url)) {
                vpn(true, tabId); // Enable VPN for whitelisted URLs
            } else {
                vpn(false, tabId); // Disable VPN for non-whitelisted URLs
            }
        } else {
            vpn(false, tabId); // Disable VPN for background requests
        }
    },
    { urls: ["<all_urls>"] }, // Match all URLs
    ["blocking"] // Options
);

// Listener to handle messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.torEnabled !== undefined && sender.tab) {
        const tabId = sender.tab.id;
        vpn(!message.torEnabled, tabId); // Reverse the torEnabled flag
    }
});

// Function to enable or disable the VPN based on the specified flag
function vpn(shouldEnable, tabId) {
    if (!tabVPNState.hasOwnProperty(tabId)) {
        tabVPNState[tabId] = false; // Default VPN state for the tab
        disableVPN(tabId); // Disable VPN initially
    }

    // Retrieve the torEnabled flag from local storage
    chrome.storage.local.get('torEnabled', function (result) {
        const torEnabled = result.torEnabled || false; // Default value false if not set
        if (torEnabled && shouldEnable) {
            if (!tabVPNState[tabId]) {
                enableVPN(tabId); // Enable VPN if torEnabled is true and shouldEnable is true
            }
        } else {
            if (tabVPNState[tabId] || !torEnabled) {
                disableVPN(tabId); // Disable VPN if torEnabled is false or shouldEnable is false
            }
        }
    });
}

// Function to disable the VPN for a specific tab
function disableVPN(tabId) {
    chrome.proxy.settings.clear({ scope: 'regular' }, function () {
        // Disable Tor proxy
        tabVPNState[tabId] = false;
        chrome.browserAction.setIcon({ path: "../../img/vpn-off.png", tabId: tabId }); // Change browser action icon
    });
}

// Function to enable the VPN for a specific tab
function enableVPN(tabId) {
    tabVPNState[tabId] = true;
    chrome.browserAction.setIcon({ path: "../../img/vpn.png", tabId: tabId }); // Change browser action icon
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
        // Do something after enabling Tor proxy if needed
    });
}

// Function to check if a URL is in the whitelist
function isInWhitelist(url) {
    return whitelist.some(pattern => new RegExp(pattern).test(url));
}
