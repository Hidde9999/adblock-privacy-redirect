
//             document.getElementById("dialog").remove()

// function handlePageLoad() {
//     currentUrl = window.location.href.toLowerCase().replace("+", " ");
//     // propagandaBlocker();
//     // blockVideoWithBlockedChannel();
//     if (currentUrl.includes("youtube.com")) {
//         // document.getElementById("dialog").remove()
//         console.log(document.getElementById("dialog"));
//     }
// }
//
// // Add navigation event listener for SPA
// if ('navigation' in window) {
//     window.navigation.addEventListener("navigate", () => {
//         setTimeout(() => {
//             currentUrl = window.location.href.toLowerCase().replace("+", " ");
//
//             if (currentUrl.includes("youtube.com")) {
//                 handlePageLoad()
//             }
//         }, 200);
//     });
// } else {
//     console.error("window.navigation is not supported in this browser.");
// }
//
// // Initial Page Load
// if (document.readyState !== "loading") {
//     handlePageLoad();
// } else {
//     // console.log("Document is not ready, adding event listener for DOMContentLoaded"); // Add logging here
//     document.addEventListener("DOMContentLoaded", fetchJsonData);
// }
