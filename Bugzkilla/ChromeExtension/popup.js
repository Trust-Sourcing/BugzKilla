(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('scrsht').addEventListener('click', function () {

            ajax('http://bugzkilla.com/account/CheckIfAuthorized', function (response) {
                if (response == "0") {
                    chrome.tabs.create({ url: "http://bugzkilla.com/Account/Login" })
                } else if (response == "1") {
                    chrome.tabs.create({ url: "http://bugzkilla.com/Home/Assembla" })
                } else {
                    document.body.style.overflow = 'hidden';
                    chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }, function (dataUri) {

                        localStorage["total_elements"] = dataUri;
                        chrome.tabs.create({ url: chrome.extension.getURL('background.html') }, function (tab) { });
                        document.body.style.overflow = 'auto';
                    });
                }
            })
        });
    });

    //tweaked Ajax functions from Quirksmode
    var ajax = function (url, callback) {
        var req = xmlHttp();
        if (!req) {
            return;
        }
        req.open("GET", url, true);
        req.onreadystatechange = function () {
            if (req.readyState != 4 || req.status != 200 && req.status != 304) {
                return;
            }
            callback(req.responseText);
        }
        if (req.readyState == 4) {
            return;
        }
        req.send(null);
    }
    //define ajax obj 
    var xmlHttp = (function () {
        var xmlhttpmethod = false;
        try {
            xmlhttpmethod = new XMLHttpRequest();
        }
        catch (e) {
            xmlhttpmethod = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return function () {
            return xmlhttpmethod;
        };
    })();


})()
