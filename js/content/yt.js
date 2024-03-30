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
    "WNL",
    "GeenStijl",
    "NPO Start",
    "NPO Radio 1",

    "Omroep PowNed",
    "Omroep Gelderland",

    "De Avondshow met Arjen Lubach | VPRO",
    "RTL Talkshow",

    "Vandaag Inside",

    "VRT NWS",
    "VRT 1",

    "The Telegraph",

    "Eurovision Song Contest",
    "ABC News",
    "BBC News",
    "CBS News",
    "CBS Mornings",
    "MSNBC",
    "Fox News",
    "FOX Weather",
    "CNN",
    "Reuters",

    "ZDF heute-show",
    "BILD",
];

const videoTitels = [
    "Overtreders",
    "Handhavers"
];

function propagandaBlocker() {
    setInterval(() => {
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

function disableJSByName() {
    const scripts = document.querySelectorAll('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === "") {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
}

function includesTitels(title) {
    return videoTitels.some(keyword => title.includes(keyword));
}

function getIP(){
    // Make a request to ipinfo.io to get the user's IP address
    fetch('https://api.ipify.org/?format=json')
        .then(response => response.json())
        .then(data => {
            // Once IP address is fetched, create and append the banner
            createBanner(data.ip);
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
        });
}

function createBanner(ip) {
    // Create header banner element
    const banner = document.createElement('div');
    banner.id = 'headerBanner';
    banner.style.backgroundColor = '#f0f0f0';
    banner.style.padding = '10px';
    banner.style.textAlign = 'center';
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.zIndex = '9999';

    // Add close button to the banner
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.addEventListener('click', function() {
        banner.style.display = 'none';
    });

    // Add text to the banner
    const bannerText = document.createElement('p');
    bannerText.textContent = `IP: ${ip}`;

    // Append elements to the banner
    banner.appendChild(closeButton);
    banner.appendChild(bannerText);

    // Append banner to the body
    document.body.appendChild(banner);

    // Listen for fullscreenchange event
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    function handleFullscreenChange() {
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) {
            // Hide the banner when fullscreen mode is activated
            banner.style.display = 'none';
        } else {
            // Show the banner if not in fullscreen mode
            banner.style.display = 'block';
        }
    }
}

window.navigation.addEventListener("navigate", () => {
    setTimeout(() => {
        if (window.location.href.includes("/shorts/")) {
            window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
        }
    }, 30);
})

if (document.readyState !== "loading") {
    propagandaBlocker();
    getIP();
    disableJSByName();
} else {
    document.addEventListener("DOMContentLoaded", propagandaBlocker);
}