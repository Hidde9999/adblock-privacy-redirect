let fakeMediaList = [
    "nos.nl",
    "www.telegraaf.nl",
    "www.volkskrant.nl",
    "www.rtlnieuws.nl",
    "www.bnnvara.nl/joop/artikelen",
    "www.ad.nl",
    "www.nrc.nl",
    "www.nu.nl"
]

// Attach the replaceTextOnSite function to the onload event of the window
window.onload = function() {
    fakeMediaCheck()
};

function fakeMediaCheck() {
    if (fakeMediaList.includes(window.location.host)){
        fakeMediaPopup()
        setTimeout(() => {
            fakeMediaReplace()
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
}

function fakeMediaReplace() {
    const replacements = [
        { target: "Nieuwsuur", replacement: "Nieuwszuur" },
        { target: "Nieuws", replacement: "Fake Nieuws" },
        { target: "desinformatie", replacement: "waarheid" },
        { target: "Belastingdienst", replacement: "Criminele organisatie die alles bij de burger wegrooft" },
        { target: "Belastingen", replacement: "dieven" },
        { target: "Belasting", replacement: "dief" },
        { target: "overheid", replacement: "corrupte overheid" },
        { target: "Hoogopgeleide", replacement: "Hoog geindoctrineerde" },

        { target: /\bongevaccineerde(n)?\b/gi, replacement: "zwarte" },
        { target: /\bgevaccineerde?\b/gi, replacement: "gifspuit krijgen" },
        { target: /\b(ge)?vaccineerde(n)?\b/gi, replacement: "opgeoferd" },
        { target: /\b(ge)?inent(en)?\b/gi, replacement: "opoferen" },
        { target: "ingeënt", replacement: "opgeoferd" },

        { target: /\bvaccinatie(s)?\b/gi, replacement: "gifspuit" },
        { target: "basisvaccinaties", replacement: "basis gifspuit" },
        { target: "Rijksvaccinatieprogramma", replacement: "Rijks liquidatie programma" },
        { target: /\bvaccin(s)?\b/gi, replacement: "gifspuiten" },
        { target: /\bvacciner(en)?\b/gi, replacement: "gifspuiten" },
        { target: /\bvaccin\b/gi, replacement: "gifspuit" },
        { target: /\bvaccinatiegraad\b/gi, replacement: "gifspuitgraad" },

        { target: /\bmazelen\b/gi, replacement: "nazie" },
        { target: /\bmazelenuitbraak\b/gi, replacement: "nazie uitbraak" },
        { target: /\bkinkhoest\b/gi, replacement: "de overheid" },
        { target: /\bpolio\b/gi, replacement: "WEF" },
        { target: /\brodehond\b/gi, replacement: "rode WEF hond" },
        { target: /\bde bof\b/gi, replacement: "de EU" },
        { target: /\bcorona\b/gi, replacement: "de griep" },
        { target: /\bcoronapandemie\b/gi, replacement: "de griep plandemie" },
        { target: /\been bacterie\b/gi, replacement: "de media" },

        { target: /\bhet RIVM\b/gi, replacement: "nep wetenschappers betaald door Big Pharma" },
        { target: /\bRIVM\b/gi, replacement: "nep wetenschappers betaald door Big Pharma" },
        { target: /\bGGD\b/gi, replacement: "nep artsen betaald door Big Pharma" },

        { target: /\bklimaat(top)?(deal)?(record)?\b/gi, replacement: "klimaat scam" },

        { target: /\bstikstof\b/gi, replacement: "stikstof hoax" },
        
        { target: /\bpresident\b/gi, replacement: "Trump" },
        { target: /\bWoke\b/gi, replacement: "Mentaal gestoord" },
        { target: /\bwokisme\b/gi, replacement: "mentaal gestoord" },
        { target: /\bdomrechts\b/gi, replacement: "communisten" },
        { target: /\bextreem-rechts\b/gi, replacement: "antifa" },
        { target: /\bextreem rechts\b/gi, replacement: "Egg-stink-tion rebeion" },
        { target: /\bduurzaamheids?\b/gi, replacement: "extra belasting aan de corrupte overheid" },
        { target: /\bduurzaamheid\b/gi, replacement: "extra belasting aan de corrupte overheid" },
        { target: /\bD66\b/gi, replacement: "Nazies" },
        { target: /\bGL-PvdA\b/gi, replacement: "Domme Communisten" },
        { target: /\bGroenLinks\b/gi, replacement: "BruinLinks" },
        { target: /\bPvdA\b/gi, replacement: "Partij Van De Ondergang" },
        { target: /\bVVD\b/gi, replacement: "Volk Val Dood" },
        { target: /\bTimmermans\b/gi, replacement: "Dik Varken" },
        { target: /\bJetten\b/gi, replacement: "Robot Jetten" },
        { target: /\bKaag\b/gi, replacement: "Ssssssiegheil Kaag" },
        { target: /\bSander Schimmelpenninck\b/gi, replacement: "Sander Schimmelpenis" }
    ];

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            replacements.forEach(({ target, replacement }) => {
                text = text.replace(target, replacement);
            });
            node.textContent = text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceText);
        }
    }

    replaceText(document.body);
}

function fakeMediaPopup() {

    // Create a div element
        const elemDiv = document.createElement('div');

    // Set styles for the div element
        elemDiv.style.cssText = 'position: relative; width: 100%; margin: 0 auto; z-index: 100000; background-color: #fff';

    // Create a p element
        const pElement = document.createElement('h1');

    // Set text content for the p element
        pElement.textContent = "Warning: This site is known for their fake news!";

    // Append the p element to the div element
        elemDiv.appendChild(pElement);

    // Insert the div element as the first child of the body
        document.body.insertBefore(elemDiv, document.body.firstChild);
}
