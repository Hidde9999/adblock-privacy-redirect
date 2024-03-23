const fakeMediaList = [
    { url: "nos.nl", language: "nl" },
    { url: "www.telegraaf.nl", language: "nl" },
    { url: "www.volkskrant.nl", language: "nl" },
    { url: "www.rtlnieuws.nl", language: "nl" },
    { url: "www.bnnvara.nl/joop/artikelen", language: "nl" },
    { url: "www.ad.nl", language: "nl" },
    { url: "www.nrc.nl", language: "nl" },
    { url: "www.nu.nl", language: "nl" },
    { url: "www.rijksoverheid.nl/", language: "nl" }
];

// Attach the replaceTextOnSite function to the onload event of the window
window.onload = function() {
    fakeMediaCheck()
};

function fakeMediaCheck() {
    let language = ""
    const isCurrentHostInFakeMediaList = fakeMediaList.some(data => {
        if (data.url.includes(window.location.host)){
            language = data.language
            return data.url.includes(window.location.host);
        }
    });

// Use the result in your conditional statement
    if (isCurrentHostInFakeMediaList) {
        fakeMediaPopup()
        setTimeout(() => {
            fakeMediaReplace(language)
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

function fakeMediaReplace(language) {
    const nlReplacements = [
        { target: "Nieuwsuur", replacement: "Nieuwszuur" },
        { target: "Nieuws", replacement: "Fake Nieuws" },

        { target: "desinformatie", replacement: "waarheid" },
        { target: "nepnieuws", replacement: "waarheid" },
        { target: /\bcorrect\b/gi, replacement: "niet waar" },
        { target: /\bincorrect\b/gi, replacement: "waar" },
        { target: "uit vrij recente studies blijkt", replacement: "uit corrupte studies betaald door de globalisten blijkt" },
        { target: "feiten", replacement: "fabels" },

        { target: "Belastingdienst", replacement: "Criminele organisatie die alles bij de burger wegrooft" },
        { target: "Belastingen", replacement: "dieven" },
        { target: "Belasting", replacement: "dief" },
        { target: "overheid", replacement: "corrupte overheid" },
        { target: "gemeente", replacement: "GEMEEN-te" },

        { target: "Hoogopgeleide", replacement: "Hoog geindoctrineerde" },

        { target: /\bongevaccineerde(n)?\b/gi, replacement: "zwarte" },
        { target: /\bongevaccineerd\b/gi, replacement: "zwart" },
        { target: /\bgevaccineerde?\b/gi, replacement: "opgeoferd" },
        { target: /\binenting\b/gi, replacement: "opoferen" },
        { target: /\b(ge)?vaccineerde(n)?\b/gi, replacement: "opgeoferd" },
        { target: /\b(ge)?inent(en)?\b/gi, replacement: "opoferen" },
        { target: "ingeënt", replacement: "opgeoferd" },

        { target: /\bvaccinatie(s)?\b/gi, replacement: "gifspuit" },
        { target: /\bVaccinatieplicht\b/gi, replacement: "gifspuitplicht" },
        { target: /\bvaccinweigeraars?\b/gi, replacement: "mensen met gezond verstand die geen gifspuiten willen" },
        { target: "basisvaccinaties", replacement: "basis gifspuit" },
        { target: "Rijksvaccinatieprogramma", replacement: "Rijks liquidatie programma" },
        { target: /\bvaccin(s)?\b/gi, replacement: "gifspuiten" },
        { target: /\bvacciner(en)?\b/gi, replacement: "gifspuiten" },
        { target: /\bvaccin\b/gi, replacement: "gifspuit" },
        { target: /\bvaccinatiegraad\b/gi, replacement: "gifspuitgraad" },

        { target: /\bmazelen\b/gi, replacement: "nazies" },
        { target: /\bmazelenbesmetting\b/gi, replacement: "naziebesmetting" },
        { target: /\bmazelenbesmettingen\b/gi, replacement: "naziebesmettingen" },
        { target: /\bmazelenvaccin\b/gi, replacement: "gifspuit tegen de nazies" },
        { target: /\bmazelenvirus\b/gi, replacement: "naziesvirus" },
        { target: /\bmazelenuitbraak\b/gi, replacement: "nazie uitbraak" },
        { target: /\bmazelenpatiënten\b/gi, replacement: "naziespatiënten" },
        { target: /\bmazelenepidemie\b/gi, replacement: "nazie epidemie" },

        { target: /\bkinkhoest\b/gi, replacement: "de overheid" },
        { target: /\bkinkhoestbesmettingen\b/gi, replacement: "de overheid besmettingen" },

        { target: /\bpolio\b/gi, replacement: "De Media Virus" },
        { target: /\brode hond\b/gi, replacement: "rode WEF hond" },
        { target: /\brodehond\b/gi, replacement: "rode WEF hond" },
        { target: /\b(de )?bof\b/gi, replacement: "de EU" },
        { target: /\bcorona(virus)?\b/gi, replacement: "de griep" },
        { target: /\bcoronapandemie\b/gi, replacement: "de griep plandemie" },

        { target: /\b(kinder)?ziek(te)?\b/gi, replacement: "Oh Hans!" },
        { target: /\bvirus\b/gi, replacement: "Oh Hans!" },

        { target: /\bziekten\b/gi, replacement: "gezonden" },
        { target: /\been bacterie\b/gi, replacement: "de media" },

        { target: /\bhet RIVM\b/gi, replacement: "nep wetenschappers betaald door Big Pharma" },
        { target: /\bRIVM\b/gi, replacement: "nep wetenschappers betaald door Big Pharma" },
        { target: /\bGGD\b/gi, replacement: "nep artsen betaald door Big Pharma" },

        { target: /\bwereldgezondheidsorganisatie\b/gi, replacement: "WereldHOAXorganisatie" },
        { target: /\bWHO\b/gi, replacement: "World HOAX Organisation" },

        { target: /\bklimaat(top)?(deal)?(record)?\b/gi, replacement: "klimaat scam" },
        { target: /\bExtinction Rebellion\b/gi, replacement: "Dombo Rebellion" },
        { target: /\bklimaatradicalen\b/gi, replacement: "klimaat gekken" },
        { target: /\bKlimaatdemonstranten\b/gi, replacement: "klimaat gekken" },

        { target: /\bstikstof\b/gi, replacement: "stikstof hoax" },

        { target: /\bVolksgezondheid( en )?(milieu)?\b/gi, replacement: "VolksONgezondheid en zogenaamd het milieu" },
        { target: /\bgezondheidsdienst\b/gi, replacement: "ONgezondheidsdienst" },

        { target: /\bpresident\b/gi, replacement: "Trump" },
        { target: /\bWoke\b/gi, replacement: "Mentaal gestoord" },
        { target: /\bwokisme\b/gi, replacement: "mentaal gestoord" },

        { target: /\bdomrechts\b/gi, replacement: "communisten" },
        { target: /\bextreem-rechts\b/gi, replacement: "antifa" },
        { target: /\bextreem rechts\b/gi, replacement: "Egg-stink-tion rebeion" },
        { target: /\brechtspopulisten\b/gi, replacement: "antifa" },
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
    const engReplacements= [

    ]

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            if (language === "nl"){
                nlReplacements.forEach(({ target, replacement }) => {
                    text = text.replace(target, replacement);
                });
            }
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
