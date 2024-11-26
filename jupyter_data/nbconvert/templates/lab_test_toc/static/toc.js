// inspired from https://benfrain.com/building-a-table-of-contents-with-active-indicator-using-javascript-intersection-observers/

// Root element at which we will insert the toc
var insertNode = document.querySelector("#toc-anchor");

// Element containing the headings
var wrappingElement = document.querySelector("body > main");
// Get all headings
var allHtags = wrappingElement.querySelectorAll("h1, h2, h3");

// Intersection Observer Options
var options = {
    root: null,
    rootMargin: "0px",
    threshold: [1],
};

// contains current tags
const state = {
    currentHtagIds: new Set(),
    lastSeen: null
}

function updateCurrent(intersectionEvents) {
    console.log("Received events", intersectionEvents)
    for (const event of intersectionEvents) {
        if (event.isIntersecting) {
            console.log("Adding", event.target)
            state.currentHtagIds.add(event.target.id)
        } else {
            console.log("Removing", event.target)
            if (state.currentHtagIds.size === 1) {
                console.log("Set lastSeen", state)
                state.lastSeen = event.target
            }
            state.currentHtagIds.delete(event.target.id)
        }
    }
    console.log("Updated", state.currentHtagIds)

    var allSectionLinks = document.querySelectorAll(".toc-item");
    allSectionLinks.forEach(link => link.classList.remove("current"));

    for (const item of allSectionLinks) {
        const target_id = item.id.substring(0, item.id.length - 9)
        if (state.currentHtagIds.size > 0) {
            if (state.currentHtagIds.has(target_id)) {
                item.classList.add("current");
                break
            }
        } else {
            if (state.lastSeen.id === target_id) {
                item.classList.add("current");
                break
            }
        }
    }
};


// Function that runs when the Intersection Observer fires
function setCurrent(e) {
    console.log("Current", e)
    console.log("Current", e.map(e => e.target))
    var allSectionLinks = document.querySelectorAll(".toc-item");
    if (allSectionLinks === undefined) {return}
    for (const item of e) {
        allSectionLinks.forEach(link => link.classList.remove("current"));
        // document.querySelector(`a[href="#${item.target.id}"]`).classList.add("current");
        document.getElementById(`${item.target.id}-toc-item`).classList.add("current");
        break;
    }
};

// Each Intersection Observer runs setCurrent
var observeHtags = new IntersectionObserver(updateCurrent, options);


function getProperListSection(heading, previousHeading, currentListElement) {
  let listSection = currentListElement;
  if (previousHeading) {
      console.log("HEADING", heading.tagName.slice(-1), previousHeading.tagName.slice(-1))
    if (heading.tagName.slice(-1) > previousHeading.tagName.slice(-1)) {
      let nextSection = document.createElement("ul");
      listSection.appendChild(nextSection);
      return nextSection;
    } else if (heading.tagName.slice(-1) < previousHeading.tagName.slice(-1)) {
      let indentationDiff =
          parseInt(previousHeading.tagName.slice(-1)) -
          parseInt(heading.tagName.slice(-1));
      while (indentationDiff > 0) {
        listSection = listSection.parentElement;
        indentationDiff--;
      }
    }
  }
  return listSection;
}


function addNavigationLinkForHeading(heading, currentSectionList) {
    let listItem = document.createElement("li");
    let link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.innerHTML = heading.innerHTML;
    listItem.appendChild(link);
    listItem.id = `${heading.id}-toc-item`;
    listItem.target_id = heading.id
    listItem.classList.add("toc-item");
    currentSectionList.appendChild(listItem);
}



// Build the DOM for the menu
function createTOC() {
    var frag = document.createDocumentFragment();
    var jsNav = document.createElement("nav");
    jsNav.classList.add("toc-wrapper");
    var tocTitle = document.createElement("h4");
    tocTitle.classList.add("toc-Title");
    tocTitle.textContent = "Table of contents";
    jsNav.appendChild(tocTitle);
    let previousHeading;
    let currentSectionList = document.createElement("ul");
    jsNav.appendChild(currentSectionList);

    allHtags.forEach((heading, index) =>  {
        currentSectionList = getProperListSection(
            heading,
            previousHeading,
            currentSectionList
        );
        addNavigationLinkForHeading(heading, currentSectionList);
        previousHeading = heading;
    });
    jsNav.appendChild(frag);
    insertNode.appendChild(jsNav);
    allHtags.forEach(tag => {
        observeHtags.observe(tag);
    });
};

(function setUp() {
    if (wrappingElement === null) {
      console.warn("Cannot find elem");
        return;
    }
  console.log("Found", wrappingElement);
    createTOC();
})();

