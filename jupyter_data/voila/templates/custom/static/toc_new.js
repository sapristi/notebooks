// from https://benfrain.com/building-a-table-of-contents-with-active-indicator-using-javascript-intersection-observers/
var insertNode = document.querySelector(".post-PimpingAintEasy");

// Wrapper for Blog post
var wrappingElement = document.getElementById("rendered_cells");

// Get all H1/H2 tags from the post
var allHtags = wrappingElement.querySelectorAll(":scope > h1, :scope > h2");

// Intersection Observer Options
var options = {
    root: null,
    rootMargin: "0px",
    threshold: [1],
};

// Each Intersection Observer runs setCurrent
var observeHtags = new IntersectionObserver(setCurrent, options);

// Build the DOM for the menu
function createTOC() {
    var frag = document.createDocumentFragment();
    var jsNav = document.createElement("nav");
    jsNav.classList.add("toc-Wrapper");
    var tocTitle = document.createElement("h4");
    tocTitle.classList.add("toc-Title");
    tocTitle.textContent = "Sections";
    jsNav.appendChild(tocTitle);
    allHtags.forEach((el, i) =>  {
        var links = document.createElement("a");
        links.setAttribute("href", "#h-" + el.tagName + "_" + i);
        links.classList.add("toc-Link");
        links.classList.add("toc-Link_" + el.tagName);
        var textContentOfLink = el.textContent;
        el.id = "h-" + el.tagName + "_" + i;
        links.textContent = textContentOfLink;
        frag.appendChild(links);
    });
    jsNav.appendChild(frag);
    insertNode.appendChild(jsNav);
    // Now 
    allHtags.forEach(tag => {
        observeHtags.observe(tag);
    });
}

// Function that runs when the Intersection Observer fires
function setCurrent(e) {
    console.log(e);
    var allSectionLinks = document.querySelectorAll(".toc-Link");
    e.map(i => {
        if (i.isIntersecting === true) {
            allSectionLinks.forEach(link => link.classList.remove("current"));
            document.querySelector(`a[href="#${i.target.id}"]`).classList.add("current");
        }
    })
}

(function setUp() {
    if (wrappingElement === null) {
        return;
    }
    createTOC();
})();
