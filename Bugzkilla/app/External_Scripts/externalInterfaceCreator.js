$.noConflict();

jQuery(document).ready(function ($) {
   
    $(window).resize(function () {
        $('#BugzKillaIframe').width($(window).width());
        $('#BugzKillaIframe').height($(window).height());
    });
    var createScreenshot = function () {
        $("#detectButtonExternal").stop().animate({ "right": "-265px" }, 20, function () {});
    };
    function reciever(message) {
        if (message.data === 'renewButton') {
            $("#detectButtonExternal").show().stop().animate({ "right": "-46px" }, 200);
            $('#BugzKillaIframe').hide();
            
        }
        var response = message.data;
        if (response.substring(0, 4) == "<div") {
            console.log('append', response)
            $('body').append(message.data);
        };
        $(document.body).css("overflow", 'auto');
    };

    var createIframe = function () {
        var bugzKillaIframe = '<div class="side-bar-detect" id="detectButtonExternal"><div class="detect-button"><p>Detect<br>Bugz</p></div></div>' +
            '<iframe id="BugzKillaIframe" name="BugzKillaIframe" frameborder="0" style="display: none; position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 9999999; background: transparent;" allowtransparency="true" src="http://localhost:2861/Home/Tool"></iframe>' +
            '<div id="loaderBugzkilla" style="display: none"></div>' +
            '<img id="imageForScreenshot" style="display: none">';
        $('body').append(bugzKillaIframe);
    };
    createIframe();

    var sendScreenshot = function () {
        var bugzKillaIframe = document.getElementById('BugzKillaIframe');
        $('.glower2').css('display', 'none');
        $("#detectButtonExternal").stop().animate({ "right": "-265px" }, 20, function () {
            $('#BugzKillaIframe').show();
            createScreenshot();
            bugzKillaIframe.contentWindow.postMessage("loading", 'http://bugzkilla.com/Home/Tool');
        });
    };

    $('body').on('mousedown', '.bkg-bounce_wrapper', function (event) {
        event.preventDefault();
        $(this).addClass('bgk-draggable').parents().on('mousemove', function (e) {
            $('.bgk-draggable').offset({
                top: e.pageY - $('.bgk-draggable').outerHeight() / 2,
                left: e.pageX - $('.bgk-draggable').outerWidth() / 2
            }).on('mouseup', function () {
                $(this).removeClass('bgk-draggable');
            });
            
        });
    }).on('mouseup', function () {
        $('.draggable').removeClass('bgk-draggable');
    });

    $('#detectButtonExternal').bind('click', function () {
        $(this).hide();
        $(document.body).css("overflow", 'hidden');
        sendScreenshot();
    });
    window.addEventListener('message', reciever, false);
});
