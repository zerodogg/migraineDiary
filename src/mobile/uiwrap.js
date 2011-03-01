(function($)
{
    var tabDiv, add, view, aboutButton, h, w;

    window.UIWidgets = {
        tabBar: function(self)
        {
            add = $('#addEntry');
            view = $('#viewEntries');
            tabDiv = $('.tabBar');

            var addButton = $('<div id="addEntryButton" />').html(_('Add entry')).button().appendTo(tabDiv);
            var viewButton  = $('<div id="viewEntriesButton" />').css({'font-weight':'normal'}).html(_('View entries')).button().appendTo(tabDiv);
            aboutButton = $('<div id="aboutButton" />').css({'font-weight':'normal', 'float':'right'}).html(_('About')).button().appendTo(tabDiv).hide();

            addButton.mClick(function()
            {
                UIWidgets.tabBarState('normal');
                add.show();
                view.hide();
                viewButton.css({'font-weight':'normal'});
                addButton.css({'font-weight':'bold'});
            });
            viewButton.mClick(function()
            {
                add.hide();
                view.show();
                viewButton.css({'font-weight':'bold'});
                addButton.css({'font-weight':'normal'});
                self.buildViewTAB();
                UIWidgets.tabBarState('extended');
            });
            aboutButton.mClick(function()
            {
                UI.showAboutDialog();
            });

            $(window).resize(function()
            {
                UIWidgets.tabBarState(UIWidgets.getTabBarState());
            });
        },

        tabBarState: function(state)
        {
            if(state == 'normal')
            {
                $('.tabBar').css({
                    'width':'100%',
                    'border-bottom-right-radius':'0px'
                });
                aboutButton.hide();
            }
            else if(state == 'extended')
            {
                var width = $('table').outerWidth();
                if($('body').width() > width)
                {
                    width = $('body').width();
                }
                $('.tabBar').css({
                    'width': width +'px',
                });
                aboutButton.show();
            }
            else if(state == 'prev')
            {
                return UIWidgets.tabBarState(prevTabBarState);
            }
        },

        getTabBarState: function()
        {
            if(aboutButton.is(':visible'))
            {
                return 'extended';
            }
            return 'normal';
        },

        mainArea:
        {
            area: null,

            init: function()
            {
                if(this.area == null)
                    this.area = $('<div />').appendTo(add).addClass('wizardContainer');
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

    var wasVisible, prevTabBarState;
    // Separate dialog implementation that fits the small screens better
    jQuery.fn.mDialog = function(args)
    {
        if( (args && $.isPlainObject(args)) || (args == null))
        {
            if(add.is(':visible'))
            {
                wasVisible = add;
            }
            else if(view.is(':visible'))
            {
                wasVisible = view;
            }
            wasVisible.hide();
            prevTabBarState = UIWidgets.getTabBarState();
            UIWidgets.tabBarState('normal');

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
                    if($.isFunction(v))
                    {
                        var button = $('<div/>').html(k).button().mClick(v).appendTo(buttons).css(css);;
                    }
                    else
                    {
                        var button = $('<a/>').attr('rel','external').attr('href',v).html(k).button().appendTo(buttons).css(css);
                    }
                    no = no +1;
                });
            }
            self.appendTo('body').show().addClass('isDialog');
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
                UIWidgets.tabBarState(prevTabBarState);
            }
        }
        return this;
    };

    jQuery.fn.mClick = function(action)
    {
        if(action)
        {
            this.mousedown(function(e)
            {
                if($(this).button('option','disabled') !== true)
                {
                    try
                    {
                        action.call(this,e);
                    } catch(e) {}
                }
                else
                {
                }
            });
            return this;
        }
        else
        {
            return this.mousedown();
        }
    };

    /*
     * Size initialization
     */
    w = $(window).width();
    h = $(window).height();
    if(w >= 800 || h >= 800)
    {
        $('body').addClass('hdpi');
    }
    else if(w > 450 || h > 450)
    {
        $('body').addClass('mdpi');
    }
    else
    {
        $('body').addClass('ldpi');
    }
})(jQuery);
