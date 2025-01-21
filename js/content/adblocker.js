const config = {
    "*": {  // Matches all URLs
        classes: ['fun-adsense'],
        ids: ['ad-id'],
        querySelectors: []  // Added querySelectors as an empty array
    },
    "jensen.nl": {  // Matches specific URL pattern
        classes: ['sc-hAIpwP'],
        ids: [],
        querySelectors: []  // Empty array for querySelectors
    },
    "www.youtube.com": {  // Matches specific URL pattern
        classes: [],
        ids: ['panels'],
        querySelectors: []  // Empty array for querySelectors
    },
    "x.com": {  // Matches specific URL pattern
        classes: [''],  // Empty class list
        ids: [],
        querySelectors: [
            'div[tabindex="0"].css-175oi2r[data-testid="birdwatch-pivot"]',
            'div.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-1qd0xha.r-n6v787.r-1cwl3u0.r-16dba41.r-1mmae3n'  // Newly added query selector
        ]
    },
    "twitter.com": {  // Matches specific URL pattern
        classes: [''],  // Empty class list
        ids: [],
        querySelectors: [
            'div[tabindex="0"].css-175oi2r[data-testid="birdwatch-pivot"]',
            'div.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-1qd0xha.r-n6v787.r-1cwl3u0.r-16dba41.r-1mmae3n'  // Newly added query selector
        ]
    },
    "ongehoordnederland.tv": {  // Matches specific URL pattern
        classes: ['bmpui-adLabel', 'bmpui-ui-textbutton'],  // Empty class list
        ids: [],
        querySelectors: []
    },

};

function beginLoad() {
    setInterval(blockAds, 250);

    if (window.location.href.indexOf("ongehoordnederland.tv") > -1) {
        const playbackToggleButton = document.querySelector('.bmpui-ui-hugeplaybacktogglebutton');

        if (playbackToggleButton) {
            playbackToggleButton.addEventListener('click', () => {
                setTimeout(() => {
                    ongehoordNederlandAdFix();
                }, 1000);
            });
        } else {
            console.log('Huge playback toggle button not found.');
        }
    }
}

function ongehoordNederlandAdFix() {
    const element = document.querySelector('[aria-label="Video speler"]');

    if (element) {
        element.className = 'bmpui-ui-uicontainer bmpui-npo-player bmpui-flexbox bmpui-layout-max-width-800 bmpui-player-state-paused';

        const rewindButton = document.querySelector('.bmpui-ui-rewindbutton');

        if (rewindButton) {
            rewindButton.click();
        } else {
            console.log('Rewind button not found.');
        }
    } else {
        console.log('Element not found.');
    }
}

function blockAds() {
    const url = window.location.href;
    let blockConfig = config["*"];  // Default config for all URLs

    for (let pattern in config) {
        if (url.includes(pattern)) {
            blockConfig = config[pattern];
            break;
        }
    }

    blockConfig.classes.forEach(className => {
        let elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            console.log(`Removing element with class: ${className}`, elements[0]);
            elements[0].parentNode.removeChild(elements[0]);
        }
    });

    blockConfig.ids.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            console.log(`Removing element with ID: ${id}`, element);
            element.parentNode.removeChild(element);
        }
    });

    // Handle querySelectors if provided
    blockConfig.querySelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            console.log(`Removing element with selector: ${selector}`, element);
            element.parentNode.removeChild(element);
        });
    });
}

// Initial Page Load
if (document.readyState !== "loading") {
    beginLoad();
} else {
    document.addEventListener("DOMContentLoaded", beginLoad);
}
