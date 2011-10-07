var jqWizard = jClass.extend([questionRenderer,wizard],{
    $menu: null,

    _constructor: function(params)
    {
        if (!params.menu)
        {
            throw('Missing menu parameter to jqWizard');
        }
        this.$menu   = $(params.menu);
        this.buildMenu();
    },

    setTitle: function(title)
    {
        $('<b/>').text( title ).appendTo(this.$target).addClass('wizardTitle');
        $('<hr/>').appendTo(this.$target);
        $('<br/>').appendTo(this.$target);
    },

    buildMenu: function()
    {
        var self = this;
        var prev = $('<div/>').html(_('Previous')).button().appendTo(this.$menu).click(function()
        {
            self.previous();
        }).attr('id','wizardPrevButton');
        var skip = $('<div/>').html(_('Skip')).button().appendTo(this.$menu).click(function()
        {
            self.skip();
        }).attr('id','wizardSkipButton');
        var cont = $('<div/>').html(_('Continue')).button().appendTo(this.$menu).click(function()
        {
            if(self.getCurrentStep().isSkippable === false)
            {
                if(self.getFieldValue() == null)
                {
                    throw('FIXME');
                }
            }
            self.next();
        }).attr('id','wizardContinueButton');

        $.subscribe('/wizard/displayStep',function(param)
        {
            if(param.step.isSkippable === false)
            {
                skip.hide();
            }
            else
            {
                skip.show();
            }
            if(param.step.type == 'selector')
            {
                cont.hide();
            }
            else
            {
                cont.show();
            }
            if(param.wizard.stack.length <= 0)
            {
                prev.hide();
            }
            else
            {
                prev.show();
            }
        });
    }
});
