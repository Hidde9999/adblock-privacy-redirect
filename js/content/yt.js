let currentUrl;
let blockedChannels = [];
let whiteList = [];
let videoTitles = [];

// Constants
const ytElementsSelector = "#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row, .style-scope.ytd-item-section-renderer";
const invidiousElementsSelector = "#contents .pure-u-1:not(.navbar)";
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
    const videoElements = currentUrl.includes("youtube.com") ? document.querySelectorAll(ytElementsSelector) : document.querySelectorAll(invidiousElementsSelector);
    if (blockedChannels === [] || videoTitles === []){
        return;
    }
    videoElements.forEach(video => {
        const channelLink = video.querySelector(".pure-u-14-24 a") || video.querySelector(".channel-name") || video.querySelector('#container #text a') || video.querySelector('#container #text') || document.querySelector("#inner-header-container #text");
        const videoTitle = video.querySelector('#video-title') || video.querySelector(".video-card-row p");

        if (!channelLink || !videoTitle) return;

        if (!channelLink.textContent || !videoTitle.textContent) return;

        if (isWhitelistedChannel(channelLink.textContent.trim())) return;

        if (isBlockedChannel(channelLink.textContent.trim())) {
            console.log("Removing video from blocked channel:", channelLink.textContent.trim());
            video.remove();
        } else if (isBlockedTitle(videoTitle.textContent.trim())) {
            console.log("Removing video with blocked title:", videoTitle.textContent.trim());
            video.remove();
        }
    });
}

function blockPage() {
    const pageManagerElement = document.getElementById("page-manager") || document.querySelector("#contents");
    if (pageManagerElement) {
        pageManagerElement.innerHTML = blockedContentsHtml;
        document.getElementById("blocked-contents").style.display = "block";
    } else {
        console.error("Element matching '#page-manager' or '#contents' not found.");
    }
}

function toInvidious() {
    chrome.storage.local.get(["toggleSwitchYT"], function (result) {
        const privacyNotice = document.createElement('div');
        privacyNotice.id = 'privacy-notice';
        privacyNotice.innerText = 'Privacy redirect is on';
        privacyNotice.style.display = "none";
        document.body.prepend(privacyNotice);

        if (!result["toggleSwitchYT"]) {
            console.log("YouTube privacy redirect is turned off!");
            privacyNotice.style.display = "none";
            return;
        }

        privacyNotice.style.display = "block";

        function backToInvidious(link) {
            window.location.href = `${link.href.replace("www.youtube.com", "invidious.privacyredirect.com")}`;
        }

        document.querySelectorAll("a").forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                backToInvidious(link);
            });
        });
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

// Main Functions
function handlePageLoad() {
    currentUrl = window.location.href.toLowerCase().replace("+", " ");
    propagandaBlocker();
    blockVideoWithBlockedChannel();
    if (currentUrl.includes("youtube.com")) {
        toInvidious();
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
            setInterval(removeBlockedVideos, 250);
        }
    });
}

function blockVideoWithBlockedChannel() {
    chrome.storage.local.get(["youtubeBlockList"], function (result) {
        if (!result["youtubeBlockList"]) {
            console.log("Propaganda blocking turned off!");
            return;
        }
        if (currentUrl.includes("/watch?")) {
            const intervalId = setInterval(function () {
                const elementToLoad = document.querySelector("#text-container a") || document.querySelector("#channel-name");
                const titleVideo = document.querySelector("#title .style-scope.ytd-watch-metadata:last-child");
                if (elementToLoad && elementToLoad.textContent && titleVideo && titleVideo.textContent) {
                    clearInterval(intervalId);
                    if (isBlockedChannel(elementToLoad.textContent)) {
                        blockPage();
                    }
                    if (isBlockedTitle(titleVideo.textContent)) {
                        blockPage();
                    }
                }
            }, 50);
        }
    });
}

// Add navigation event listener for SPA
if ('navigation' in window) {
    window.navigation.addEventListener("navigate", () => {
        setTimeout(() => {
            currentUrl = window.location.href.toLowerCase().replace("+", " ");
            const blockedContents = document.getElementById("blocked-contents");

            if (blockedContents) {
                blockedContents.style.display = "none";
            } else {
                console.warn("Element with ID 'blocked-contents' not found.");
            }

            if (currentUrl.includes("/shorts/")) {
                window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
            }

            if (currentUrl.includes("youtube.com")) {
                toInvidious();
            }

            blockVideoWithBlockedChannel();
        }, 200);
    });
} else {
    console.error("window.navigation is not supported in this browser.");
}

// Initial Page Load
if (document.readyState !== "loading") {
    // console.log("Document is ready, fetching JSON data"); // Add logging here
    fetchJsonData();
    handlePageLoad();
} else {
    // console.log("Document is not ready, adding event listener for DOMContentLoaded"); // Add logging here
    document.addEventListener("DOMContentLoaded", fetchJsonData);
}
