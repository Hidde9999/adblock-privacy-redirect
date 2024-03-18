document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const statusText = document.getElementById('statusText');
    const bypassInput = document.getElementById('bypassInput');
    const addBypassButton = document.getElementById('addBypassButton');
    const bypassItems = document.getElementById('bypassItems');
    getIP()
    function getIP(){
        // Make a request to ipinfo.io to get the user's IP address
        fetch('https://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(data => {
                // Extract and display the IP address
                document.getElementById('ip-address').textContent = `Your IP address is: ${data.ip}`;
                // document.getElementById('ip-address').textContent = `Your IP address is: ${data.ip} from ${data.region}`;
                toggleButton.disable = false
            })
            .catch(error => {
                console.error('Error fetching IP address:', error);
                document.getElementById('ip-address').textContent = 'Error fetching IP address';
            });
    }


    // Set initial status
    chrome.storage.local.get(['torEnabled'], function(result) {
        const torEnabled = result.torEnabled === undefined ? false : result.torEnabled;
        setStatusText(torEnabled);
    });

    // Load and display bypass list
    chrome.storage.local.get(['bypassList'], function(result) {
        const bypassList = result.bypassList || [];
        bypassList.forEach(function(url) {
            displayBypassItem(url);
        });
    });

    // Listen for button click event to toggle Tor proxy
    toggleButton.addEventListener('click', function () {
        toggleButton.disable = true
        chrome.storage.local.get(['torEnabled'], function(result) {
            let torEnabled = result.torEnabled === undefined ? false : result.torEnabled;
            torEnabled = !torEnabled;
            chrome.storage.local.set({ 'torEnabled': torEnabled });
            setStatusText(torEnabled);
            chrome.runtime.sendMessage({ torEnabled: torEnabled });
            getIP()
        });
    });

    // Listen for button click event to add item to bypass list
    addBypassButton.addEventListener('click', function () {
        const url = bypassInput.value.trim();
        if (url) {
            chrome.storage.local.get(['bypassList'], function(result) {
                const bypassList = result.bypassList || [];
                bypassList.push(url);
                chrome.storage.local.set({ 'bypassList': bypassList });
                bypassInput.value = '';
                displayBypassItem(url);
            });
        }
    });

    // Function to set status text
    function setStatusText(enabled) {
        statusText.textContent = enabled ? "Enabled" : "Disabled";
    }

    // Function to display bypass list item
    function displayBypassItem(url) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('bypassItem');
        itemDiv.textContent = url;

        const deleteButton = document.createElement('span');
        deleteButton.classList.add('deleteButton');
        deleteButton.textContent = '❌';
        deleteButton.addEventListener('click', function () {
            chrome.storage.local.get(['bypassList'], function(result) {
                let bypassList = result.bypassList || [];
                bypassList = bypassList.filter(function(item) {
                    return item !== url;
                });
                chrome.storage.local.set({ 'bypassList': bypassList });
                itemDiv.remove();
            });
        });

        itemDiv.appendChild(deleteButton);
        bypassItems.appendChild(itemDiv);
    }
});
