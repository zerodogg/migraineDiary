var UIWidgets = {
    tabBar: function(self)
    {
        var tabDiv = $('<div />');
        var tabBar = $('<ul />').append('<li><a href="#addEntry">'+_('Add entry')+'</a></li>'+
                                        '<li><a href="#viewEntries">'+_('View entries')+'</a></li>');
        tabDiv.append(tabBar);
        tabDiv.append('<div id="addEntry"></div>'+
                      '<div id="viewEntries">View entries tab</div>');
        $('body').append(tabDiv);
        tabDiv.tabs({
            show: function (event,UI)
            {
                if(UI.index == 1)
                    self.buildViewTAB();
            }
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
// Dialog wrapper ensuring proper placement on mobile platforms
jQuery.fn.mDialog = function(args)
{
    if(jQuery.browser.isMobile && jQuery.isPlainObject(args))
    {
        $.extend(args,{
            position: ['left','top' ]
        });
    }
    this.dialog(args);
};
