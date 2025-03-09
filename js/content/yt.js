let currentUrl;
let blockedChannels = [];
let whiteList = [];
let videoTitles = [];

// Constants
const ytElementsSelector = ".style-scope.ytd-rich-grid-renderer, #dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row, .style-scope.ytd-item-section-renderer";
const blockedContentsHtml = `
    <div class="blocked-container" id="blocked-contents">
        <h1>This page is blocked</h1>
        <p>The content you're trying to access is not available due to propaganda.</p>
    </div>`;

// Helper Functions
function isBlockedChannel(channelName) {
    return blockedChannels.includes(channelName);
}

function isWhitelistedChannel(channelName) {
    return whiteList.some(keyword => channelName.toLowerCase().includes(keyword.toLowerCase()));
}

function isBlockedTitle(title) {
    return videoTitles.some(blockedTitle => title.toLowerCase().includes(blockedTitle.toLowerCase()));
}

function removeBlockedVideos() {
    const videoElements = document.querySelectorAll(ytElementsSelector);
    if (blockedChannels === [] || videoTitles === []){
        return;
    }

    videoElements.forEach(video => {
        const channelTitle = document.querySelector("#page-header .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap") || video.querySelector('#container #text a');
        const channelLink = video.querySelector(".pure-u-14-24 a") || video.querySelector(".channel-name") || video.querySelector('#container #text a') || video.querySelector('#container #text') || document.querySelector("#inner-header-container #text");
        const videoTitle = video.querySelector('#video-title') || video.querySelector(".video-card-row p");

        if (!channelLink || !videoTitle) return;

        if (channelTitle){
            if (isWhitelistedChannel(channelTitle.textContent.trim())) return;
        }

        if (isBlockedChannel(channelLink.textContent.trim())) {
            console.log("Removing video from blocked channel:", channelLink.textContent.trim());
            video.remove();
        }
        if (isBlockedTitle(videoTitle.textContent.trim())) {
            console.log("Removing video with blocked title:", videoTitle.textContent.trim());
            video.remove();
        }
    });
}

// Fetch JSON Data
async function fetchJsonData() {
    try {
        const response = await fetch(chrome.runtime.getURL("json/blocklistYoutube.json"));
        const data = await response.json();
        blockedChannels = data.blockedChannels;
        whiteList = data.whiteList;
        videoTitles = data.videoTitles;
    } catch (error) {
        console.error('Failed to fetch JSON data:', error);
    }
}

function autoReject() {
    const popup = document.getElementById("dialog");
    if(popup){
        const rejectButton = document.querySelectorAll("#dialog .yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--enable-backdrop-filter-experiment");

        if(rejectButton[0]){
            rejectButton[0].click();
        }
    }
}

// Main Functions
function handlePageLoad() {
    currentUrl = window.location.href.toLowerCase().replace("+", " ");
    propagandaBlocker();
    // blockVideoWithBlockedChannel();
    if (currentUrl.includes("youtube.com")) {
        autoReject();
    }
}

function propagandaBlocker() {
    chrome.storage.local.get(["youtubeBlockList"], function (result) {
        if (!result["youtubeBlockList"]) {
            console.log("Propaganda blocking turned off!");
            return;
        }
        if (
            currentUrl.includes("/search?") ||
            currentUrl.includes("/results") ||
            currentUrl.includes("/channel") ||
            currentUrl.includes("/videos") ||
            currentUrl.includes("/watch?") ||
            currentUrl.includes('/feed/popular') ||
            currentUrl.includes('/feed/trending') ||
            currentUrl === "https://www.youtube.com/"
        ) {
            setInterval(removeBlockedVideos, 500);
        }
    });
}

// Add navigation event listener for SPA
if ('navigation' in window) {
    window.navigation.addEventListener("navigate", () => {
        setTimeout(() => {
            currentUrl = window.location.href.toLowerCase().replace("+", " ");
            // const blockedContents = document.getElementById("blocked-contents");

            // if (blockedContents) {
            //     blockedContents.style.display = "none";
            // } else {
            //     console.warn("Element with ID 'blocked-contents' not found.");
            // }

            if (currentUrl.includes("/shorts/")) {
                window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
            }

            propagandaBlocker();
            autoReject();
            // blockVideoWithBlockedChannel();
        }, 200);
    });
} else {
    console.error("window.navigation is not supported in this browser.");
}

// Initial Page Load
if (document.readyState !== "loading") {
    console.log("Document is ready, fetching JSON data"); // Add logging here
    fetchJsonData();
    handlePageLoad();
} else {
    // console.log("Document is not ready, adding event listener for DOMContentLoaded"); // Add logging here
    // document.addEventListener("DOMContentLoaded", fetchJsonData);
}
