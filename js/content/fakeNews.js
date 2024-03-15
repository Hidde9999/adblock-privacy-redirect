let fakeMediaList = [
    "nos.nl",
    "www.telegraaf.nl",
    "www.telegraaf.nl",
    "www.volkskrant.nl",
    "www.rtlnieuws.nl",
    "www.bnnvara.nl/joop/artikelen",
    "www.ad.nl",
    "www.nrc.nl"
]

// Attach the replaceTextOnSite function to the onload event of the window
window.onload = function() {
    fakeMediaCheck()
};

function fakeMediaCheck() {
    if (fakeMediaList.includes(window.location.host)){
        fakeMediaPopup()
        fakeMediaReplace()
        setTimeout(() => {
            document.title = "Hitler Times";
        }, 50);
    }
}

function fakeMediaReplace() {
    // Create a recursive function to traverse through all elements
    function replaceText(node, word, replaceWord) {
        // Check if the node is a text node
        if (node.nodeType === Node.TEXT_NODE) {
            // Replace text content if it contains the word
            node.textContent = node.textContent.replace(new RegExp(word, 'gi'), replaceWord);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Iterate through child nodes of element
            for (const childNode of node.childNodes) {
                // Recursively call replaceText for each child node
                replaceText(childNode, word, replaceWord);
            }
        }
    }

    // Start from the body element
    replaceText(document.body, "Nieuwsuur", "Nieuwszuur");
    replaceText(document.body, "Nieuws", "Fake Nieuws");

    replaceText(document.body, "ongevaccineerde", "zwarte");
    replaceText(document.body, "niet-ingeënte", "zwarte");
    replaceText(document.body, "ingeënt", "blank");
    replaceText(document.body, "mazelen", "nazies");
    replaceText(document.body, "vaccinatie", "gifspuit");
    replaceText(document.body, "vaccins", "gifspuiten");
    replaceText(document.body, "vaccineren", "gifspuiten");
    replaceText(document.body, "vaccin", "gifspuit");

    replaceText(document.body, "klimaat", "weer");
    replaceText(document.body, "president", "Trump");

    replaceText(document.body, "domrechts", "communisten");
    replaceText(document.body, "extreem-rechts", "antifa");
    replaceText(document.body, "extreem rechts", "Egg-stink-tion rebeion");

    replaceText(document.body, "duurzaamheids", "extra belasting aan de corrupte overheid");
    replaceText(document.body, "duurzaamheid", "extra belasting aan de corrupte overheid");

    replaceText(document.body, "D66", "Nazies");
    replaceText(document.body, "GL-PvdA", "Domme Communisten");
    replaceText(document.body, "GroenLinks", "BruinLinks");
    replaceText(document.body, "PvdA", "Partij Van De Ondergang");
    replaceText(document.body, "VVD", "Volk Val Dood");

    replaceText(document.body, "Timmermans", "Dik Varken");
    replaceText(document.body, "Jetten", "Robot Jetten");
    replaceText(document.body, "Kaag", "Ssssssiegheil Kaag");



    replaceText(document.body, "Sander Schimmelpenninck", "Sander Schimmelpenis");
}

function fakeMediaPopup() {

    // Create a div element
        const elemDiv = document.createElement('div');

    // Set styles for the div element
        elemDiv.style.cssText = 'width: 100%; margin: 0 auto;';

    // Create a p element
        const pElement = document.createElement('h1');

    // Set text content for the p element
        pElement.textContent = "This site is known for their fake news!"; // Corrected "there" to "their"

    // Append the p element to the div element
        elemDiv.appendChild(pElement);

    // Insert the div element as the first child of the body
        document.body.insertBefore(elemDiv, document.body.firstChild);
}
