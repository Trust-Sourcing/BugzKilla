(function () {

    if (window.routeController.partName == 'tool') {

        var helpers = {
            needToRemoveLastScrn: true,

            divForTool: '#DivForTool',
            divForToolRectLayer: '#DivForTool_rectanglelayer',

            colorInHexFormat: localStorage["basicColor"] === undefined ? '#45ca58' : localStorage["basicColor"].toString(),
            borderThikness: localStorage["basicThickness"] === undefined ? "2px" : localStorage["basicThickness"].toString(),

            loader: $("#loaderBugzkilla"),

            createDivForTool: function () {
                if ($('#DivForTool').length === 0) {
                    var divForTool = '<div id="DivForTool"></div><div id="DivForTool_rectanglelayer"></div>';
                    $('body').append(divForTool);
                };
            },

            removeDivForTool: function () {
                var self = this;
                $(self.divForTool).remove();
                $(self.divForToolRectLayer).remove();
            },

            closeBugzkilla: function () {
                $('.side-bar-toolsdetect').removeClass('active');
                $('.side-bar-detect').addClass('active');
            },

            turnBugzkilla: function () {
                $('.side-bar-toolsdetect').addClass('active');
                $('.side-bar-detect').removeClass('active');
            },

            hexToRgb: function (hex) {
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },

            launchLoader: function () {
                var self = this;
                self.loader.fadeIn("fast");
            },

            turnOffLoader: function () {
                var self = this;
                self.loader.fadeOut("slow");
            }
        }

        var assemblaController = {
            screenshotPrev: '.screenshotPreview',

            selectSpace: '.js-selectSpace',
            createTicket: '.js-createTicket',
            milestones: '.js-milestones',
            listOfUsers: '.js-listOfUsers',
            listOfStatuses: '.js-listOfStatuses',
            listOfTags: '.js-tags',
            newOrAdd: '.js-new-or-add',

            validate: '.modal-val',

            btnCloseModal: '.js-closeModal',

            btnAddScreenshot: '.js-addScrn',
            
            isNewTicket: false,

            assemblaSpaces: "https://www.assembla.com/spaces/",
            bugCounter: 1,

            init: function () {
                var self = this;
                self.getSpaces();
                self.bindEvents();
            },

            openModal: function () {
                window.location.hash = "#openModal";
            },
            openPopup: function () {
                window.location.hash = "#openPopup";
            },

            closeModalOrPopup: function () {
                window.location.hash = "";
            },

            getSpaces: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getSpaces,
                    method: "GET"
                }).done(function (response) {
                    if (response.Spaces === null) {
                        $(self.selectSpace).html('<option value="" disabled selected hidden>Login assembla!</option>');
                    } else {
                        $.each(response.Spaces, function (key, space) {
                            $(self.selectSpace).append('<option value=' + space.Id + '>' + space.Name + '</option>').prop('disabled', false);
                        });
                    }
                });
            },

            getTickets: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getTickets,
                    method: "GET"
                }).done(function (response) {
                    if (response.ListOfTickets === null) {
                        $(self.newOrAdd).find('input').val('No tickets available!');
                    } else {
                        self.availableTickets = response.ListOfTickets;
                        var content = '';
                        $.each(response.ListOfTickets, function (index, ticket) {
                            content += '<li><span class="js-tick-num">#' + ticket.number + ' </span><a class="dropdown__items" value=' + ticket.id + '>' + ticket.summary + '</a></li>';
                        });

                        $('.js-dropdown-menu').append(content);
                    }
                });
            },

            getTags: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getTags,
                    method: "GET"
                }).success(function (response) {
                    if (response.ListOfTags !== null) {
                        var content = '';
                        $(self.listOfTags).clear();
                        $.each(response.ListOfTags, function (key, el) {
                            content += '<li><div class="sw-inp "><input type="checkbox" autocomplete="off" value="' + el.Name + '" id="tag-' + el.Id + '" class="js-category"> ' +
                                       '<label for="tag-' + el.Id + '"><span class="ico-box"></span>' + el.Name + '</label></div></li>';
                        });
                        $(self.listOfTags).append(content);
                        $('.js-multi-select').MultiApplySelect();

                    } else {
                        $(self.listOfTags).empty();
                    }
                });
            },

            getStatuses: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getStatuses,
                    method: "GET"
                }).done(function (response) {

                    $(self.listOfStatuses).prop('disabled', false);
                    $(self.listOfStatuses).html('<option value="" disabled selected hidden>Choose status</option>');
                    $.each(response.ListOfStatuses, function (key, el) {
                        $(self.listOfStatuses).append('<option value="' + el.Name + '">' + el.Name + '</option>');
                    });
                });
            },

            getMilestones: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getMilestone,
                    method: "GET"
                }).done(function (response) {
                    if (response.ListOfMilestones === null) {
                        $(self.milestones).html('<option value="" disabled selected hidden>Login assembla!</option>');
                    } else {
                        $(self.milestones).html('<option value="" disabled selected hidden>Choose milestone</option>').prop('disabled', false);;
                        $.each(response.ListOfMilestones, function (key, milestone) {
                            $(self.milestones).append('<option value=' + milestone.Id + '>' + milestone.Title + '</option>');
                        });
                    }
                });
            },

            getUsers: function () {
                var self = this;
                $.ajax({
                    url: window.routeController.getUsers,
                    method: "GET"
                }).done(function (response) {
                    $(self.listOfUsers).prop('disabled', false);
                    $(self.listOfUsers).html('<option value="" disabled selected hidden>Choose user</option>');
                    $.each(response.ListOfUsers, function (key, user) {
                        $(self.listOfUsers).append('<option value=' + user.Id + '>' + user.Name + '</option>');
                    });
                });
            },

            uploadFile: function (ticketId) {
                var self = this;
                var screenshots = [];
                $(self.screenshotPrev).each(function () { screenshots.push($(this).attr('src')) });

                $.ajax({
                    url: window.routeController.uploadFile,
                    method: "POST",
                    data: { listSrc: screenshots }
                }).done(function (response) {

                    var titles = response.titles;
                    self.attachFilesToTicket(ticketId, titles);

                }).fail(function () {
                    helpers.turnOffLoader();
                    return false;
                });
            },

            attachFilesToTicket: function (ticketId, titles) {
                $.ajax({
                    url: window.routeController.attachFile,
                    method: "POST",
                    data: {
                        ticketId: ticketId,
                        fileNames: titles
                    }
                });
            },

            updateStatus: function (ticketNumber) {
                var self = this;
                var ticket = {
                    number: ticketNumber,
                    status: $(self.listOfStatuses).val()
                };
                $.ajax({
                    url: window.routeController.updateStatus,
                    method: "POST",
                    data: ticket
                });
            },

            addCommentToTicket: function (comment, ticketNumber) {
                var self = this;

                var data = {
                    comment: comment,
                    ticketNumber: ticketNumber
                };

                $.ajax({
                    url: window.routeController.addCommentToTicket,
                    method: "POST",
                    data: data
                }).done(function (ticketResponse) { });
            },

            createTicketAjax: function (data) {
                var self = this;
                $.ajax({
                    url: self.isNewTicket ? window.routeController.createTicket : window.routeController.updateTicket,
                    method: "POST",
                    data: data
                }).done(function (ticketResponse) {
                    if (self.isNewTicket && ticketResponse.ticket === null) {
                        return false;
                    }
                    var ticket = self.isNewTicket ? ticketResponse.ticket : self.ticket;
                    if (!self.isNewTicket) {
                        self.addCommentToTicket($('.js-description').val(), ticket.number);
                    }

                    self.uploadFile(ticket.id);

                    self.updateStatus(ticket.number);

                    var pin = "<div class='bkg-bounce_wrapper' title='Click to redirect to ticket #" + ticket.number + "'><a target='_blank' href='" + self.assemblaSpaces +
                      $(self.selectSpace).val() + "/tickets/" + ticket.number + "' class='bkg-pin bkg-bounce' style='background:" + helpers.colorInHexFormat + "'><p>" +
                      self.bugCounter + "</p></a><div class='bkg-pulse'></div></div>";

                    $('.js-scrnAttach').empty(); //

                    self.closeModalOrPopup();
                    helpers.removeDivForTool();

                    $('#MyImagination').attr('src', '').hide();

                    $('body').append(pin).css('cursor', "default");
                    self.bugCounter++;

                    helpers.closeBugzkilla();
                    helpers.turnOffLoader();

                    $('.bkg-bounce_wrapper:last').draggable();

                    return false;

                }).fail(function () {
                    helpers.turnOffLoader();
                });
            },

            setDefaultSpace: function () {
                var self = this,
                    data = { space: $(self.selectSpace).val() },
                    input;

                $(self.newOrAdd).empty();
                $('.js-description').text('');


                if (self.isNewTicket) {
                    input = '<p>Title</p><input type="text" class="inputs__txt-box js-title" required />';
                    $('.js-desc-title').text('Description');
                } else {
                    input = '<p>Ticket</p><div class="dropdown js-dropdown"><input class="js-dropdown-title" number="" value="Select Ticket" disabled />' +
                        '<ul class="dropdown-menu js-dropdown-menu"></ul></div>';
                    $('.js-desc-title').text('Comment');
                }

                $(self.newOrAdd).append(input);

                $.ajax({
                    url: window.routeController.setDefaultSpace,
                    method: "POST",
                    data: data
                }).done(function () {
                    self.getStatuses();
                    self.getTags();
                    self.getMilestones();
                    self.getUsers();
                    $('.side-bar-detect').show();
                });
            },

            bindEvents: function () {
                var self = this;

                $(".js-closePopup").on('click', function () {
                    self.closeModalOrPopup();
                    $(tool.sideBarToolDetect).addClass('active').show();
                    $('.figureScrn:last').remove();
                });

                $(self.selectSpace).one('change', function () {
                    $('.js-modal-btn').addClass('active');
                    $('.js-add-to-ticket').prop('disabled', false);
                    $('.js-new-ticket').prop('disabled', false);
                });

                $(document).on('click', '.js-dropdown', function () {
                    $('.dropdown-menu').toggleClass('active');
                });

                $(document).on('click', '.js-dropdown li', function (e) {
                    var _this = $(this);

                    $.each(self.availableTickets, function (i, el) {
                        if (el.id === _this.find('a').attr('value')) {
                            self.ticket = el;
                        }
                    });

                    $('.js-dropdown-title').val(_this.find('a').text()).attr('number', self.ticket.number).prop('disabled', false);
                    $('.js-listOfUsers').val(self.ticket.assigned_to_id);
                    $('.js-listOfStatuses').val(self.ticket.status);
                    $('.js-priority').val(self.ticket.priority);
                    $('.js-milestones').val(self.ticket.milestone_id);
                    if (self.isNewTicket) {
                        $('.js-description').text('').text(self.ticket.description);
                    }

                });

                $('.js-add-to-ticket').click(function () {
                    self.isNewTicket = false;
                    self.setDefaultSpace();
                    self.getTickets();
                    self.closeModalOrPopup();
                    self.openModal();
                });

                $('.js-new-ticket').click(function () {
                    self.isNewTicket = true;
                    self.setDefaultSpace();
                    self.closeModalOrPopup();
                    self.openModal();
                });

                $(self.btnAddScreenshot).click(function () {
                    helpers.removeDivForTool();
                    helpers.createDivForTool();

                    $(tool.sideBarToolDetect).addClass('active');
                    self.closeModalOrPopup();
                });

                $(self.btnCloseModal).click(function () {
                    self.closeModalOrPopup();
                    if (helpers.needToRemoveLastScrn) {
                        $('.figureScrn:last').remove();
                    }
                    $(tool.sideBarToolDetect).addClass('active');
                    helpers.needToRemoveLastScrn = true;
                });

                $(self.createTicket).click(function (e) {
                    e.preventDefault();
                    helpers.launchLoader();
                    helpers.needToRemoveLastScrn = true;

                    var $title = self.isNewTicket ? $('.js-title') : $('.js-dropdown-title');

                    $title.val().trim() === '' ? $title.addClass('modal-val') : $title.removeClass('modal-val');

                    $.each($('select.inputs:required'), function (i, el) {
                        !$(el).find('option:not(:disabled)').is(':selected') ? $(el).addClass('modal-val') : $(el).removeClass('modal-val');
                    });

                    if ($(self.validate).length > 0) {
                        return false;
                    }

                    var tags = new Array();
                    var $selectedTags = $('.js-category:checked');

                    if ($selectedTags.length > 0) {
                        $.each($selectedTags, function (index, el) {
                            tags.push($(el).val());
                        });
                    }
                    var data = {
                        "ticket": {
                            number: self.isNewTicket ? null : $title.attr('number'),
                            "summary": $title.val(),
                            "priority": $('.js-priority').val(),
                            "description": $('.js-description').val(),
                            "assigned_to_id": $(self.listOfUsers).val(),
                            'milestone_id': $(self.milestones).val(),
                            tags: tags
                        }
                    };

                    self.createTicketAjax(data);

                    return false;
                });
            }
        }

        var tool = {

            colorInHexFormatStatic: '#45ca58',
            divForTool: '#DivForTool',
            divForToolRectLayer: '#DivForTool_rectanglelayer',
            fontIcon: '.tool-font-icon',
            rapha: '#rapha',
            rectangle: '#rectangle',
            toolboxWrap: '.toolbox-wrap',

            sideBarToolDetect: '.side-bar-toolsdetect',

            mousedown: false,

            paper: {}, //raphaelJs object

            pin: '.bkg-bounce_wrapper',

            rectangleCounter: 0,
            textRectangleCounter: 0,

            elemClicked: new Array(),
            elemCreated: new Array(),

            init: function () {
                var self = this;
                self.bindEvents();
                self.initSlider();
                var src = localStorage["total_elements"].toString();
                $('#myImgBack').attr('src', src);

            },
            initSlider: function () {
                var self = this;
                self.slySlider = new Sly($('.js-slideFrame'), {
                    slidee: $('.scrnSlider'),
                    horizontal: true,
                    itemNav: 'basic',
                    smart: 0,
                    scrollBy: 1,
                    mouseDragging: 1,
                    swingSpeed: 0.2,
                    dragHandle: 1,
                    elasticBounds: 0,
                    speed: 600,
                    startAt: 0
                }).init();
            },

            activateSlider: function () {
                var self = this;
                self.slySlider.destroy();
                self.initSlider();
            },

            makeScreenshot: function () {
                var self = this;
                $(self.pin).hide();
                $(self.sideBarToolDetect).hide(0, function() {
                    chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }, function (dataUri) {

                        helpers.turnOffLoader();
                        helpers.createDivForTool();
                        var img = dataUri;
                        $('.js-scrnAttach').append('<figure class="figureScrn"><div class="bgkCloseTooltip"></div><img class="screenshotPreview" src="' + img + '" width="200" height="118" alt=""></figure>');
                        $(self.pin).show();
                        $(self.sideBarToolDetect).show();
                        $(self.sideBarToolDetect).removeClass('active');
                        $('body').css('cursor', 'default');
                        self.activateSlider();
                        assemblaController.openPopup();
                    });
                });
            },

            bindEvents: function () {
                var self = this;

                $('.pickColor').on('change', function () {
                    var color = $(this).val();
                    helpers.colorInHexFormat = color;
                    localStorage["basicColor"] = color;
                });

                $(self.toolboxWrap).click(function (e) {
                    var $this = $(this);
                    $('.active-tool').removeClass('active-tool');
                    $this.addClass('active-tool');

                    if ($this.hasClass('turnRedRectangle')) {
                        $('body').css('cursor', "crosshair");

                        $(self.rapha).css({
                            'z-index': '99',
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%'
                        });

                        helpers.createDivForTool();

                        $(self.divForTool).unbind('mousemove');
                        $(self.divForTool).unbind('mousedown');
                        $(self.divForTool).unbind('mouseup');

                        // var xStaticCoordinate, yStaticCoordinate;

                        if ($(self.rectangle + self.rectangleCounter).length === 0) {

                            $(self.divForTool).mousedown(function (e) {
                                if ($(e.target).is('rect')) {
                                    return;
                                }
                                self.mousedown = true;
                                $(self.divForTool).css({
                                    'z-index': '9999'
                                });

                                self.X = e.pageX;
                                self.Y = e.pageY;

                                var rectangle = '<div id="rectangle' + self.rectangleCounter + '" class="redRectangle"></div>';

                                self.elemCreated.push('rectangle' + self.rectangleCounter);

                                $(self.divForToolRectLayer).append(rectangle);
                            });

                            $(self.divForTool).mouseup(function () {

                                $(self.divForTool).css({
                                    'z-index': '997'
                                });
                                self.mousedown = false;
                                var closeTooltip = '<div class="bgkCloseTooltip"></div>';

                                $(self.rectangle + self.rectangleCounter).append(closeTooltip);

                                $(self.rectangle + self.rectangleCounter).css({
                                    'z-index': '998'
                                })
                                    .draggable({
                                        containment: "parent"
                                    })
                                    .resizable({
                                        handles: "n, e, s, w, se, sw, ne, nw"
                                    })
                                    .on('click', function (e) {

                                        if ($(this).is(e.target) && $(this).has(e.target).length === 0) {
                                            $(this).addClass('removeIfDelPress');
                                            $('.removeIfDelPress').not(this).removeClass('removeIfDelPress');
                                        }
                                    });

                                if ($(self.rectangle + self.rectangleCounter).width() < 20 || $(self.rectangle + self.rectangleCounter).height() < 20) {
                                    $(self.rectangle + self.rectangleCounter).remove();
                                }

                                self.rectangleCounter++;
                            });

                            $(self.divForTool).mousemove(function (e2) {
                                if (!self.mousedown) {
                                    return;
                                }

                                var xDynamicCoordinate = e2.pageX;
                                var yDynamicCoordinate = e2.pageY;

                                var rectWidth = self.X - xDynamicCoordinate;
                                var rectHeight = self.Y - yDynamicCoordinate;

                                var leftResult, topResult;

                                if (rectWidth > 0) {
                                    leftResult = xDynamicCoordinate;
                                } else {
                                    rectWidth = -rectWidth;
                                    leftResult = self.X;
                                }

                                if (rectHeight > 0) {
                                    topResult = yDynamicCoordinate;
                                } else {
                                    rectHeight = -rectHeight;
                                    topResult = self.Y;
                                }

                                $(self.rectangle + self.rectangleCounter).css({
                                    position: 'absolute',
                                    left: leftResult,
                                    top: topResult,
                                    width: rectWidth,
                                    height: rectHeight,
                                    border: helpers.borderThikness + ' solid ' + helpers.colorInHexFormat
                                });

                            });
                        }
                    }
                    else if ($this.hasClass('freeLine')) {

                        $('body').css('cursor', 'crosshair');

                        helpers.createDivForTool();

                        $(self.rapha).css({
                            'z-index': '99',
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%'
                        });

                        $(self.divForTool).css('display', 'block');
                        $(self.divForTool).unbind('mousedown');
                        $(self.divForTool).unbind('mousemove');
                        $(self.divForTool).unbind('mouseup');

                        if ($(self.rapha).length === 0) {
                            self.paper = Raphael("DivForTool");
                            self.paper.canvas.setAttribute('id', 'rapha');
                            self.paper.canvas.setAttribute('style', 'position: absolute');
                        }

                        var freeLineArray = [];

                        var lastX,
                            lastY,
                            path,
                            pathString,
                            pathString2,
                            pathStringM;

                        $(self.divForTool).mousedown(function (e) {
                            if (e.target.id == 'rapha') {
                                $(self.divForTool).css({
                                    'z-index': '9999'
                                });
                                self.mousedown = true;
                                var x = e.offsetX,
                                    y = e.offsetY;
                                if (x != 0 && y != 0) {
                                    pathString = 'M' + x + ', ' + y + 'l0 0';
                                    pathString2 = 'M' + x + ",";
                                    path = self.paper.path(pathString);
                                }

                                path.attr({
                                    'stroke': helpers.colorInHexFormat,
                                    'stroke-linecap': 'round',
                                    'stroke-linejoin': 'round',
                                    'stroke-width': helpers.borderThikness
                                });

                                $(path.node).attr({
                                    'id': 'frln' + x + y
                                });
                                self.elemCreated.push('frln' + x + y);

                                lastX = x;
                                lastY = y;
                                pathStringM = pathString2;
                            }
                        });

                        $(self.divForTool).mouseup(function () {
                            freeLineArray.length = 0;
                            self.mousedown = false;
                            $(self.divForTool).css({
                                'z-index': '997'
                            });
                        });

                        $(self.divForTool).mousemove(function (event) {
                            if (!self.mousedown) {
                                return;
                            }
                            var x = event.pageX,
                                y = event.pageY;

                            if ((x - lastX) != 0 || (y - lastY) != 0) {
                                pathString += 'l' + (x - lastX) + ' ' + (y - lastY);
                                path.attr('path', pathString);
                            }
                            lastX = event.pageX;
                            lastY = event.pageY;
                        });
                    }
                    else if ($this.hasClass('turnArrow')) {

                        $('body').css('cursor', 'crosshair');
                        helpers.createDivForTool();

                        $(self.rapha).css({
                            'z-index': '99',
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%'
                        });

                        $(self.divForTool).css('display', 'block');

                        var arrow, arrowHead1, rectAngle, rectX, rectY, line, widthOfRectArea, slider;
                        if ($(self.rapha).length == 0) {
                            self.paper = Raphael("DivForTool");
                            self.paper.canvas.setAttribute('id', 'rapha');
                            self.paper.canvas.setAttribute('style', 'position: absolute');
                        }

                        var drawArrow = function (x, y, headOrLine) {

                            var element = self.paper.path("M" + x + " " + y);
                            element.attr({
                                stroke: helpers.colorInHexFormat,
                                "stroke-width": helpers.borderThikness
                            });

                            $(element.node).attr('id', 'arw' + x + y + headOrLine);

                            return element;
                        }; //DrawArrow

                        $(self.divForTool).unbind('mousedown');
                        $(self.divForTool).unbind('mousemove');
                        $(self.divForTool).unbind('mouseup');

                        $(self.divForTool).mousedown(function (eve) {
                            if (eve.target.id == 'rapha') {
                                $(this).css('z-index', '99999');

                                var offset = $(self.divForTool).offset();
                                var mouseDownX = eve.pageX - offset.left + 1;
                                var mouseDownY = eve.pageY - offset.top + 1;

                                arrow = drawArrow(mouseDownX, mouseDownY, 'line');
                                arrowHead1 = drawArrow(mouseDownX, mouseDownY, 'head');

                                line = self.paper.rect(mouseDownX, mouseDownY, 0, 0);
                                $(line.node).attr('id', 'lineForArr' + mouseDownX + mouseDownY);

                                slider = self.paper.set(arrow, arrowHead1, line);
                                slider.hover(function () {
                                    document.body.style.cursor = 'move';
                                }, function () {
                                    document.body.style.cursor = 'crosshair';
                                });

                                slider.click(function (e) {
                                    self.elemClicked = [];
                                    self.elemClicked.push($(this[0]).attr('id'));
                                    self.elemClicked.push($(this.prev[0]).attr('id'));
                                    self.elemClicked.push($(this.prev.prev[0]).attr('id'));
                                });

                                var arrowArray = [];
                                for (var i = 0; i < 3; i++) {
                                    arrowArray.push(slider[i].node.id);
                                }
                                self.elemCreated.push(arrowArray);

                                $(self.divForTool).mousemove(function (event) {
                                    //  event.preventDefault();
                                    var x1 = mouseDownX;
                                    var y1 = mouseDownY;

                                    var x2 = event.pageX - offset.left;
                                    var y2 = event.pageY - offset.top;

                                    //--- Nujno sdvinut liniu na 3-5 px   //-------http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
                                    //--- nujna normal: 
                                    var normali = Math.sqrt(
                                        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
                                    );
                                    //--- prirost
                                    var dx = (x2 - x1) / normali;
                                    var dy = (y2 - y1) / normali;

                                    var path = "M" + x1 + " " + y1 +
                                        "L" + ((x2 > 0 ? x2 : 0) - dx * 4) + " " + ((y2 > 0 ? y2 : 0) - dy * 4);
                                    arrow.attr("path", path);

                                    var angle = 100;
                                    var d = 10; // triangle form
                                    var h = Math.abs(d / Math.cos(angle));
                                    var lineangle = Math.atan2(y2 - y1, x2 - x1);
                                    var angle1 = lineangle + Math.PI + angle;
                                    var angle2 = lineangle + Math.PI - angle;
                                    var arrowHead1Path = "M" + (x2 + Math.cos(angle1) * h) + " " + (y2 + Math.sin(angle1) * h) +
                                        "L" + x2 + " " + y2 +
                                        "L" + (x2 + Math.cos(angle2) * h) + " " + (y2 + Math.sin(angle2) * h) +
                                        "L" + (x2 + Math.cos(angle1) * h) + " " + (y2 + Math.sin(angle1) * h);

                                    arrowHead1.attr({
                                        "stroke-width": 1,
                                        "path": arrowHead1Path,
                                        "fill": helpers.colorInHexFormat
                                    });

                                    widthOfRectArea = 16;
                                    rectAngle = Raphael.angle(x1, y1, x2, y2);
                                    rectX = (x1 - 20 * dx +
                                        Math.cos((rectAngle + 90) * Math.PI / 180) * widthOfRectArea);
                                    rectY = (y1 - 20 * dy +
                                        Math.sin((rectAngle + 90) * Math.PI / 180) * widthOfRectArea);

                                    var path = "M" + x1 + " " + y1 +
                                        "L" + ((x2 > 0 ? x2 : 0) - dx * 4) + " " + ((y2 > 0 ? y2 : 0) - dy * 4);
                                    arrow.attr("path", path);

                                    line.attr({
                                        x: rectX,
                                        y: rectY,
                                        width: Math.sqrt(Math.pow(x2 - x1 + 40 * dx, 2) +
                                            Math.pow(y2 - y1 + 40 * dy, 2)),
                                        height: widthOfRectArea * 2,
                                        fill: 'transparent',
                                        "stroke-width": 0
                                    });

                                    line.transform("");
                                    line.transform("R" + (rectAngle - 180) + "," + rectX + "," + rectY + "...");
                                });

                            }
                        });
                        $(self.divForTool).mouseup(function () {
                            $(self.divForTool).unbind('mousemove');
                            $(this).css('z-index', '997');
                            var ft = self.paper.freeTransform(slider, {
                                attrs: {
                                    fill: 'transparent',
                                    stroke: 'transparent'
                                },
                                drag: true,
                                keepRatio: true
                            });
                        });
                    }
                    else if ($this.hasClass('turnTextInRedRectangle')) {

                        $('body').css('cursor', 'crosshair');

                        $(self.rapha).css({
                            'z-index': '99',
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%'
                        });

                        helpers.createDivForTool();

                        $(self.divForTool).unbind('mousemove');
                        $(self.divForTool).unbind('mousedown');
                        $(self.divForTool).unbind('mouseup');

                        if ($('#textRectangleId' + self.textRectangleCounter).length === 0) {

                            // drawing a rectangle
                            $(self.divForTool).mousedown(function (e) {
                                if ($(e.target).is('rect')) {
                                    return;
                                }
                                $(self.divForTool).css({
                                    'z-index': '9999'
                                });

                                var textRectangle = '<div class="redRectangle" id="textRectangleId' + self.textRectangleCounter + '" style="display: none" ><textarea id="input' + self.textRectangleCounter + '"></textarea></div>';
                                var tooltip = '<div class="bgkCloseTooltip"></div>';

                                self.elemCreated.push('textRectangleId' + self.textRectangleCounter);
                                $(self.divForToolRectLayer).append(textRectangle);
                                $('#textRectangleId' + self.textRectangleCounter).append(tooltip);

                                var leftResult, topResult, textWidth, textHeight;

                                var xStaticCoordinate = e.pageX;
                                var yStaticCoordinate = e.pageY;

                                $(self.divForTool).mousemove(function (e2) {
                                    var xDynamicCoordinate = e2.pageX;
                                    var yDynamicCoordinate = e2.pageY;

                                    var rectWidth = xStaticCoordinate - xDynamicCoordinate;
                                    var rectHeight = yStaticCoordinate - yDynamicCoordinate;

                                    if (rectWidth > 0) {
                                        leftResult = xDynamicCoordinate;
                                    } else {
                                        rectWidth = -rectWidth;
                                        leftResult = xStaticCoordinate;
                                    }
                                    if (rectHeight > 0) {
                                        topResult = yDynamicCoordinate;
                                    } else {
                                        rectHeight = -rectHeight;
                                        topResult = yStaticCoordinate;
                                    }

                                    $('#textRectangleId' + self.textRectangleCounter).css({
                                        position: 'absolute',
                                        left: leftResult,
                                        top: topResult,
                                        border: helpers.borderThikness + ' solid ' + helpers.colorInHexFormat
                                    });

                                    $('#input' + self.textRectangleCounter).css({
                                        position: 'absolute',
                                        resize: 'none',
                                        margin: 5,
                                        top: 0,
                                        left: 0,
                                        border: 'none',
                                        'font-size': 20,
                                        'box-sizing': 'content-box',
                                        padding: 0,
                                        color: "#262626"
                                    });

                                    if ((rectHeight - 10) < 0 || (rectWidth - 10) < 0) {
                                        textWidth = 0;
                                        textHeight = 0;
                                    } else {
                                        textWidth = rectWidth - 15;
                                        textHeight = rectHeight - 15;
                                    }

                                    $('#textRectangleId' + self.textRectangleCounter).css({
                                        'background-color': 'white',
                                        width: rectWidth,
                                        height: rectHeight,
                                        display: 'block'
                                    });

                                    $('#input' + self.textRectangleCounter).css({
                                        width: textWidth,
                                        height: textHeight
                                    });
                                });
                            });

                            $(self.divForTool).mouseup(function () {
                                $(self.divForTool).css({
                                    'z-index': '997'
                                });
                                $(self.divForTool).unbind('mousemove');

                                $('#textRectangleId' + self.textRectangleCounter).draggable({
                                    containment: "parent"
                                })
                                    .resizable({
                                        handles: 'w, s, n, e, se'
                                    })
                                    .css({
                                        'z-index': '998'
                                    })
                                    .resize(function () {
                                        $(this).find('textarea').width($(this).width() - 9);
                                        $(this).find('textarea').height($(this).height() - 9);
                                    });

                                $('#input' + self.textRectangleCounter).focus();

                                if ($('#textRectangleId' + self.textRectangleCounter).width() < 50 || $('#textRectangleId' + self.textRectangleCounter).height() < 50) {
                                    $('#textRectangleId' + self.textRectangleCounter).remove();
                                }


                                self.textRectangleCounter++;

                            });
                        };
                    }
                    else if ($this.hasClass('thicknessTool')) {
                        $('.widthSelector').addClass('active');
                    }
                });

                $(document).on('click', '.bgkCloseTooltip', function () {
                    var $parentEl = $(this).parent();
                    if ($parentEl.is('figure')) {
                        helpers.needToRemoveLastScrn = false;
                    }
                    $parentEl.remove();
                }); //deletor

                $('.js-proceed').click(function () {
                    $('.redRectangle').css('z-index', '999');
                    $(self.divForTool).css('z-index', '999');

                    self.makeScreenshot();
                });

                $('[data-icon]').click(function (e) {
                    e.stopPropagation();
                    var thick = $(this).attr('value');
                    helpers.borderThikness = thick;
                    localStorage["basicThickness"] = thick;
                    $('.widthSelector').removeClass('active');
                });

                $('.toolbox-wrap-send-btn').click(function () {
                    $('.redRectangle').css('z-index', '999');
                    $(self.divForTool).css('z-index', '999');
                    self.makeScreenshot();
                });

                $(".side-bar-detect").click(function () {
                    $('body').css('cursor', "crosshair");
                    $('.turnRedRectangle').trigger('click');
                    helpers.turnBugzkilla();
                });

                $(".ico-back-btn").click(function () {
                    $('body').css('cursor', "default");

                    helpers.removeDivForTool();
                    helpers.closeBugzkilla();
                });

            }

        }

        $(document).ready(function () {
            assemblaController.init();
            tool.init();
            localStorage["basicColor"] = helpers.colorInHexFormat;
            $(".side-bar-detect").trigger('click');
            $('.modalDialog').css('display', 'block');
        });

        $(document).keydown(function (e) {
            if (e.keyCode == 46) {
                for (var i = 0; i < tool.elemClicked.length; i++) {
                    $('#' + elemClicked[i]).remove();
                }
                tool.elemClicked = [];
            }
            if (e.keyCode == 90 && e.ctrlKey) {

                if (tool.elemCreated.length != 0) {
                    if (tool.elemCreated[tool.elemCreated.length - 1].length == 3) {
                        for (var j = 0; j < 3; j++) {
                            $('#' + tool.elemCreated[tool.elemCreated.length - 1][j]).remove();
                        }
                    } else {
                        $('#' + tool.elemCreated[tool.elemCreated.length - 1]).remove();
                    }
                    tool.elemCreated.splice(tool.elemCreated.length - 1, 1);
                }
            }

        });

    }
})();
