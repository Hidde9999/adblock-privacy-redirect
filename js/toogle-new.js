function switchToInvidious() {

    // Query the active tab to get its ID and URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // tabs is an array of tabs that match the query parameters
        if (tabs.length > 0) {
            const currentTab = tabs[0];
            const tabId = currentTab.id;
            const url = currentTab.url;
            const newUrl = url.replace("www.youtube.com" , "invidious.privacyredirect.com");
            console.log('Current tab URL:', url);

            // Check if the current tab is from youtube.com
            if (url.includes("youtube.com")) {
                // Update the URL of the tab to Invidious
                chrome.tabs.update(tabId, { url: newUrl }, function(updatedTab) {
                    console.log('Tab URL updated successfully:', updatedTab.url);
                });
            } else {
                console.log('Current tab is not from YouTube.');
            }
        } else {
            console.log('No active tabs found.');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.href.toLowerCase();

    if (currentUrl.includes("home.html")){
        getFilterList()

        setSwitchFromLocalStorage("toggleSwitchYT")
        setSwitchFromLocalStorage("toggleSwitchTwitter")
        setSwitchFromLocalStorage("toggleSwitchGoogle")
        setSwitchFromLocalStorage("toggleSwitchGoogleFonts")
        // setSwitchFromLocalStorage("toggleSwitchGmail")

        // Add event listener to the switch
        document.getElementById("toggleSwitchYT").addEventListener("change", handleToggle("toggleSwitchYT"))
        // Add event listener to the switch
        document.getElementById("toggleSwitchTwitter").addEventListener("change", handleToggle("toggleSwitchTwitter"))
        // Add event listener to the switch
        document.getElementById("toggleSwitchGoogle").addEventListener("change", handleToggle("toggleSwitchGoogle"))
        // Add event listener to the switch
        document.getElementById("toggleSwitchGoogleFonts").addEventListener("change", handleToggle("toggleSwitchGoogleFonts"))
        // Add event listener to the switch
        // document.getElementById("toggleSwitchGmail").addEventListener("change", handleToggle("toggleSwitchGmail"))
    }

    if (currentUrl.includes("youtube.html")){
        setSwitchFromLocalStorage("youtubeBlockList");
        setSwitchFromLocalStorage("youtubeBlockAds");

        // Add event listener to the switch
        document.getElementById("youtubeBlockList").addEventListener("change", handleToggle("youtubeBlockList"));
        // Add event listener to the switch
        document.getElementById("youtubeBlockAds").addEventListener("change", handleToggle("youtubeBlockAds"));
        document.getElementById('invidiousButton').addEventListener('click', function(){switchToInvidious();});
    }

    if (currentUrl.includes("media.html")){
        setSwitchFromLocalStorage("mediaWarning");
        setSwitchFromLocalStorage("mediaReplceWords");

        // Add event listener to the switch
        document.getElementById("mediaWarning").addEventListener("change", handleToggle("mediaWarning"));
        // Add event listener to the switch
        document.getElementById("mediaReplceWords").addEventListener("change", handleToggle("mediaReplceWords"));
    }
});

// Function to set switch based on localStorage value
function setSwitchFromLocalStorage(switchId) {
    chrome.storage.local.get([switchId], function(result) {
        console.log("Value currently is " + result[switchId]);
        let switchElement = document.getElementById(switchId);
        const switchValue = result[switchId];
        if (switchValue) {
            if (!switchElement) {
                setTimeout(function() {
                    switchElement = document.getElementById(switchId);
                    if (switchElement) {
                        switchElement.checked = true;
                    }
                }, 100);
            } else {
                switchElement.checked = true;
            }
        }
    });
}

// Function to handle switch change
function handleToggle(name) {
    return function () {
        const isChecked = this.checked;
        let obj = {};
        obj[name] = !!isChecked;
        chrome.storage.local.set(obj, function() {
            if (isChecked) {
                console.log(name + " Switch is ON");
                // Perform actions when switch is ON
            } else {
                console.log(name + " Switch is OFF");
                // Perform actions when switch is OFF
            }
        });
    }
}

// Function to retrieve all items
function getAllItems() {
    chrome.storage.local.get(null, function(items) {
        console.log("All items in storage: ", items);
    });
}

// Call the function to log all items
getAllItems();

// Uncommented and corrected getFilterList function

function getFilterList() {
    // Get the div element
    const filtersDiv = document.getElementById('filters');
    // Create a list element
    const list = document.createElement('div');

    // Parse stored filter names from localStorage
    // const blockFiltersNames = JSON.parse(localStorage.getItem("filterNames"));

    fetch('../json/blocklist.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each key-value pair in the data object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(key);
                    const labelFilterName = document.createElement('label');
                    labelFilterName.textContent = key;
                    const labelFilterGroup = document.createElement('label');
                    labelFilterGroup.className = "switch";
                    const inputToggle = document.createElement('input');
                    inputToggle.type = "checkbox"; // Set the input type to checkbox
                    inputToggle.id = `${key}Filter`;
                    const spanSlider = document.createElement('span');
                    spanSlider.className = "slider";
                    list.appendChild(labelFilterName);
                    labelFilterGroup.appendChild(inputToggle);
                    labelFilterGroup.appendChild(spanSlider);
                    list.appendChild(labelFilterGroup);

                    // Add event listener to the switch
                    inputToggle.addEventListener("change", handleToggle(`${key}Filter`));

                    // Set the switch based on localStorage value
                    setSwitchFromLocalStorage(`${key}Filter`);
                }
            }
            // Call blockAdsAndTrackers after all patterns are pushed
            setTimeout(blockAdsAndTrackers, 100);
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });

    // Append the list to the div
    filtersDiv.appendChild(list);
}
