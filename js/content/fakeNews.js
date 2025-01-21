function handlePageLoad() {
    fakeMediaCheck();
    fakeMediaPopup();
}

// Add navigation event listener for SPA
if ('navigation' in window) {
    window.navigation.addEventListener("navigate", () => {
        setTimeout(() => {
            fakeMediaCheck();
        }, 200);
    });
} else {
    console.error("window.navigation is not supported in this browser.");
}

function fakeMediaCheck() {
    chrome.storage.local.get(["mediaWarning"], function (result) {
        if (!result["mediaWarning"]) {
            console.log("Media warning turned off!");
            return;
        }

        fetch(chrome.runtime.getURL("json/fakemedia.json"))
            .then(response => response.json())
            .then(data => {
                const fakeMediaList = data.fakeMediaList;

                let replacements = []

                let language = "";

                const isCurrentHostInFakeMediaList = fakeMediaList.some(site => {
                    if (site.url.includes(window.location.host)) {
                        language = site.language;

                        if (language === "nl") {
                            replacements = data.nlReplacements;
                        } else if (language === "en") {
                            replacements = data.enReplacements;
                        }

                        return site.url.includes(window.location.host);
                    }
                });

                if (isCurrentHostInFakeMediaList) {
                    setTimeout(() => {
                        chrome.storage.local.get(["mediaReplceWords"], function (result) {
                            if (!result["mediaReplceWords"]) {
                                console.log("Media replace words turned off!");
                                return;
                            }
                            fakeMediaReplace(language, replacements);
                        })
                        document.title = "Hitler Times";
                        let link = document.querySelector("link[rel~='icon']");
                        if (!link) {
                            link = document.createElement('link');
                            link.rel = 'icon';
                            document.head.appendChild(link);
                        }
                        link.href = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Swastika_nazi.svg';
                    }, 50);
                }
            })
            .catch(error => console.error('Error loading replacement data:', error));
    })
}

function fakeMediaReplace(language, replacements) {
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
                replacements.forEach(({ target, replacement }) => {
                    const regex = new RegExp(target, 'gi');
                    text = text.replace(regex, replacement);
                });
            // Capitalize the first letter of each sentence
            text = text.replace(/(?:^|\.\s+)([a-z])/g, (match, p1) => p1.toUpperCase());
            node.textContent = text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceText);
        }
    }

    replaceText(document.body);
}

function fakeMediaPopup() {
    // Create overlay element
    const overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    overlay.classList.add("overlay");

    // Create popup element
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // Create popup content
    const popupContent = document.createElement("div");
    popupContent.innerHTML = `
        <h2>Fake News Alert</h2>
        <p>Warning: This site is known for their fake news!!</p>
        <button id="closeBtn">Close</button>
    `;

    // Append popup content to popup element
    popup.appendChild(popupContent);

    // Append popup element to overlay
    overlay.appendChild(popup);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Function to close the popup
    function closePopup() {
        overlay.style.display = "none";
    }

    // Add event listener to close button
    document.getElementById("closeBtn").addEventListener("click", closePopup);
}

// Initial Page Load
if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}
