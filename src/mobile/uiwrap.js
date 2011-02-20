var UIWidgets = {
    tabBar: function(self)
    {
        var tabDiv = $('.tabBar');
        var add = $('<div id="addEntryButton" />').css({'font-size':'10pt'}).html(_('Add entry')).button().appendTo(tabDiv);
        var view = $('<div id="viewEntriesButton" />').css({'font-size':'10pt','font-weight':'normal'}).html(_('View entries')).button().appendTo(tabDiv);
        add.click(function()
        {
            $('.tabBar').css({
                'width':'100%',
                'border-bottom-right-radius':'0px'
            });
            $('#addEntry').show();
            $('#viewEntries').hide();
            view.css({'font-weight':'normal'});
            add.css({'font-weight':'bold'});
        });
        view.click(function()
        {
            $('#addEntry').hide();
            $('#viewEntries').show();
            view.css({'font-weight':'bold'});
            add.css({'font-weight':'normal'});
            self.buildViewTAB();
            var width = $('table').outerWidth();
            if($('body').width() > width)
            {
                width = $('body').width();
            }
            $('.tabBar').css({
                'width': width +'px',
            });
        });
    },

    mainArea:
    {
        area: null,

        init: function()
        {
            if(this.area == null)
                this.area = $('<div/>').appendTo($('#addEntry')).addClass('wizardContainer');
        },

        setContent: function(cont)
        {
            this.init();
            return this.area.html(cont);
        },

        transitionContent: function(cont)
        {
            this.init();
            return this.setContent(cont);
        }
    }
};

(function($)
{
    var wasVisible;
    // Separate dialog implementation that fits the small screens better
    jQuery.fn.mDialog = function(args)
    {
        if( (args && $.isPlainObject(args)) || (args == null))
        {
            wasVisible = $(':visible').find('#addEntry, #viewEntries');
            wasVisible.hide();
            $('.ui-button').button("option", "disabled", true);
            var self = this;
            if(args != null)
            {
                var buttons = $('<div/>').css({marginTop: '1em'}).appendTo(self);;
                var no = 0;
                $.each(args.buttons, function(k,v)
                {
                    var css = {
                        float: 'right'
                    };
                    if(no > 0)
                    {
                        css['margin-right'] = '6px';
                    }
                    var button = $('<div/>').html(k).button().click(v).appendTo(buttons).css(css);;
                    no = no +1;
                });
            }
            this.appendTo('body').show().addClass('isDialog');;
        }
        else
        {
            if (args == 'close')
            {
                $('.ui-button').button("option", "disabled", false);
                wasVisible.show();
                if (!this.is('.isDialog'))
                {
                    this.parents('.isDialog').remove();
                }
                else
                {
                    this.remove();
                }
            }
        }
    };
})(jQuery);
jQuery.browser.isNativeMobile = true;
