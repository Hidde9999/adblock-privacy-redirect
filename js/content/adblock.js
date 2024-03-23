// let getRequestsToModify = []

// modifyGetRequests()
// function modifyGetRequests() {
//     console.log("hier")
//     chrome.webRequest.onBeforeRequest.addListener(
//         function (details) {
//             // Modify the URL by replacing the IP address with "0.0.0.0"
//             const modifiedUrl = details.url.replace(/(\d+\.\d+\.\d+\.\d+)/, '0.0.0.0');
//             console.log(modifiedUrl);
//             // Return the modified URL
//             return {redirectUrl: modifiedUrl};
//         },
//         {urls: ["<all_urls>"]},
//         ["blocking"]
//     );
// }
