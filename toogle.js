// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Set YouTube switch
    setSwitchFromLocalStorage("toggleSwitchYT", "youtubeRedirect");
    // Set Twitter switch
    setSwitchFromLocalStorage("toggleSwitchTwitter", "twitterRedirect");

    // Add event listener to the switch
    document.getElementById("toggleSwitchYT").addEventListener("change", handleToggle("youtubeRedirect"));
    // Add event listener to the switch
    document.getElementById("toggleSwitchTwitter").addEventListener("change", handleToggle("twitterRedirect"));
});

// Function to set switch based on localStorage value
function setSwitchFromLocalStorage(switchId, localStorageKey) {
    const switchValue = localStorage.getItem(localStorageKey);
    if (switchValue === "true") {
        document.getElementById(switchId).checked = true;
    }
}

// Function to handle switch change
function handleToggle(name) {
    return function() {
        const isChecked = this.checked;
        localStorage.setItem(name, isChecked ? "true" : "false");
        if (isChecked) {
            console.log(name +" Switch is ON");
            // Perform actions when switch is ON
        } else {
            console.log(name +" Switch is OFF");
            // Perform actions when switch is OFF
        }
    };
}
