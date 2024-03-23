const blockedChannels = [
    // NOS
    "NOS",
    "NOS Sport",
    "NOS op 3",
    "NOS Jeugdjournaal",
    "NOS Stories",
    "NOS Nieuws van de Week",
    "Nieuwsuur",

    "De Telegraaf",
    "RTL Nieuws",
    "BNR",

    "Omroep PowNed",
    "De Avondshow met Arjen Lubach | VPRO",
    "RTL Talkshow",

    "Vandaag Inside",

    "VRT NWS",

    "The Telegraph"
];

const videoTitels = [
    "Overtreders",
    "Handhavers"
];

function onReady() {
    setInterval(() => {
        // const videoElements = document.querySelectorAll("#dismissible, #content-section, .style-scope.ytd-rich-grid-row");
        const videoElements = document.querySelectorAll("#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row");

        videoElements.forEach(function (video) {
            const channelLink = video.querySelector('#channel-name a, #info-section #text, #container #text');
            const videoTitle = video.querySelector('#video-title, #video-title .style-scope.ytd-video-renderer');
            if (channelLink && blockedChannels.includes(channelLink.innerHTML)) {
                video.remove()
            }
            if (videoTitle && includesTitels(videoTitle.innerHTML)){
                video.remove()
            }
        });
    }, 250);
}
if (document.readyState !== "loading") {
    onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

function includesTitels(title) {
    return videoTitels.some(keyword => title.includes(keyword));
}