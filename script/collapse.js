/* code for talks */
var coll = document.getElementsByClassName("collapsible");
var i;
var j;
var content;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}
/* expand current year */
if (coll != null && coll.length > 0) {
  if (window.location.href.includes('seminars.html')){
	  coll[0].classList.toggle("active")
	  coll[0].nextElementSibling.style.maxHeight = coll[0].nextElementSibling.scrollHeight + "px"
	  coll[2].classList.toggle("active")
	  coll[2].nextElementSibling.style.maxHeight = coll[2].nextElementSibling.scrollHeight + "px"
	} else {
	  coll[0].classList.toggle("active")
	  coll[0].nextElementSibling.style.maxHeight = coll[0].nextElementSibling.scrollHeight + "px"
	}
}

/* code for small menu */
coll = document.getElementsByClassName("menu-toggle");
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    var menuitems = this.parentNode.children;
    for (j = 1; j < menuitems.length; j++) {
      if (!menuitems[j].style) {continue}
      if (menuitems[j].style.display == "none") {
        menuitems[j].style.display = "";
      } else {
        menuitems[j].style.display = "none";
      }
    }
  });
}

/* Execute once to hide menu */
menuitems = document.getElementsByClassName("menu-toggle")[0].parentNode.children;
for (j = 1; j < menuitems.length; j++) {
  if (!menuitems[j].style) {continue}
  if (menuitems[j].style.display == "none") {
    menuitems[j].style.display = "";
  } else {
    menuitems[j].style.display = "none";
  }
}

/* code for research */
coll = document.querySelectorAll(".newsrow, .readMore")
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    /*get surrounding div*/
    var parentDiv = this;
    while (parentDiv.nodeName != "DIV") {
      parentDiv = parentDiv.parentNode
    }
    /*get "more"*/
    parentDiv.getElementsByClassName("readMore")[0].classList.toggle("hidden");
    if (parentDiv.style.maxHeight){
      parentDiv.style.maxHeight = null;
    } else {
      parentDiv.style.maxHeight = parentDiv.scrollHeight + "px";
    } 
  });
}

/* code to make hash work in safari, i.e. jump to correct seminar series */
window.onload = function() {
  if(location.hash != "") {
	location.href = location.hash;
  }
}