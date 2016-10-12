/* Jquery plugin written by Roman Fanta. Trustsourcing.com */

(function ($) {

    $.fn.MultiApplySelect = function (options) {

        var factory = $.extend({
            wordCount: 1,
            placeholderNone: 'No category selected',
            placeholderAll: 'All categories selected',
            placeholderItem: ' category selected',
            selectClass: '.js-select',
            labelClass: '.js-label',
            pickAllClass: '.js-select-all',
            btnApplyClass: '.js-btn-apply'
        }, options);

        var ret = this.each(function () {
            var selObj = this; // the original select object.

            this.ApplySelect = {

                $Obj: $(selObj),
                $Select: $(selObj).find(factory.selectClass),
                $CheckBoxeHolder: $(selObj).find('li'),
                $Label: $(selObj).find(factory.labelClass),
                $PickAll: $(selObj).find(factory.pickAllClass),
                $BtnApply: $(selObj).find(factory.btnApplyClass),

                init: function () {
                    var self = this;
                    self._main();
                    self._bindE();
                    self.CheckedLine = self._collectChecked();
                },
                _main: function () {
                    var self = this;

                    var tSelected = [],
						cTotal = 0;

                    self.$CheckBoxeHolder.each(function (i, obj) {
                        $obj = $(obj);
                        cTotal++;
                        if ($obj.find('input').is(':checked')) {
                            //$obj.addClass('selected');

                            tSelected.push(
								$obj
									.find('label')
									.text()
							);
                        } else {
                            //$(obj).removeClass('selected');
                        }
                    });

                    var CSelected = tSelected.length;

                    if (CSelected == 0) {
                        self.$Label.text(factory.placeholderNone);
                    } else if ((CSelected > 0) && (factory.wordCount >= CSelected)) {
                        self.$Label.text(tSelected.join(', '));
                    } else if (CSelected === cTotal) {
                        self.$Label.text(factory.placeholderAll);
                    } else {
                        self.$Label.text(CSelected + factory.placeholderItem);
                    }

                    if (CSelected === cTotal) {
                        self.$PickAll.prop("checked", true);
                    } else {
                        self.$PickAll.prop("checked", false);
                    }

                },
                _collectChecked: function () {
                    var self = this;

                    return self.$CheckBoxeHolder.find('input:checked').map(function () {
                        return parseInt(this.value);
                    }).get().join();
                },
                _close: function () {
                    var self = this;
                    self.$Obj.removeClass('is_open');
                },
                _bindE: function () {
                    var self = this;

                    self.$Select.click(function (e) {
                        e.preventDefault();
                        if (self.$Obj.hasClass('is_open')) {
                            self._close();
                        } else {
                            self.$Obj.addClass('is_open');
                        }
                    });

                    self.$Obj.find('input').change(function () {
                        self._main();

                        if (self.CheckedLine != self._collectChecked()) {
                            var TopOffParent = parseInt($(this).offset().top) - parseInt(self.$Obj.offset().top);
                            self.$BtnApply.css({ 'top': TopOffParent }).addClass('is_active');
                        } else {
                            self.$BtnApply.css({ 'top': 0 }).removeClass('is_active');
                        }
                    });

                    self.$PickAll.click(function () {
                        var bolSwitch = $(this).is(":checked");
                        self.$CheckBoxeHolder.each(function (i, obj) {
                            $(obj).find('input').prop("checked", bolSwitch);
                        });
                        self._main();
                    });

                    self.$BtnApply.click(function (e) {
                        e.preventDefault();
                        self.CheckedLine = self._collectChecked();
                        self.$BtnApply.css({ 'top': 0 }).removeClass('is_active');
                        self._close();
                    });

                    $(document).on('mousedown', function (e) {
                        if (!$(e.target).closest(self.$Obj).length) {
                            self._close();
                        }
                    });

                }

            };

            selObj.ApplySelect.init();
        });

        return ret.length == 1 ? ret[0] : ret;
    };

}(jQuery));