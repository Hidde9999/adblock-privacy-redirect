document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.href.toLowerCase();

    if (currentUrl.includes("index.html")){
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
    const blockFiltersNames = JSON.parse(localStorage.getItem("filterNames"));

    // Check if blockFiltersNames is not null and is an array
    if (Array.isArray(blockFiltersNames)) {
        blockFiltersNames.forEach(key => {
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
        });
    } else {
        console.error("Filter names not found or not in expected format.");
    }

    // Append the list to the div
    filtersDiv.appendChild(list);
}
