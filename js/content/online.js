chrome.runtime.sendMessage({ action: "checkOnlineStatus" }, response => {
    if (response.online) {
        console.log("User is online.");
        // You can perform actions when the user is online
    } else {
        console.log("User is offline.");
        // You can perform actions when the user is offline
    }
});
