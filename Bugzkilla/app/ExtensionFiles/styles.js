window.onload = function () {

    var bootstrap = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css';
    var bootstrapMultiselect = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/css/bootstrap-multiselect.css';
    var bootstrapColorpicker = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.5/css/bootstrap-colorpicker.min.css';
    var jqueryui = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.css';
    var tool = chrome.extension.getURL('css/tool.css');

    var cssList = [];
    cssList.push(bootstrap, bootstrapMultiselect, bootstrapColorpicker, jqueryui, tool);

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
  
