window.onload = function () {
    
    var tool = chrome.extension.getURL('css/style.css');

    var cssList = [];
    cssList.push(tool);

    if (window.location.href == chrome.extension.getURL('background.html')) {

        for (var i = 0; i < cssList.length; i++) {
            var css = document.createElement("link");
            css.type = "text/css";
            css.rel = "stylesheet";
            css.href = cssList[i];
            document.getElementsByTagName("head")[0].appendChild(css);
        }
      
    } else {
        var styleSheets = document.styleSheets;
        for (var j = 0; j < styleSheets.length; j++) {
            for (var k = 0; k < cssList.length; k++) {
                if (styleSheets[j].href == cssList[k]) {
                    styleSheets[j].disabled = true;
                }
            }
        }
    }
}
  
