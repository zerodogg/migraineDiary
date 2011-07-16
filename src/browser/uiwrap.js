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
jQuery.fn.mClick = jQuery.fn.click;
