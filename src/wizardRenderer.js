/*
 * This class extends the questionRenderer from questionRenderer.js, which
 * handles the rendering of question steps, as well as wizard from wizard.js
 * which implements the back-end logic for the wizard.
 */
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
        var previousButton = $('<div/>').html(_('Previous')).button().appendTo(this.$menu).click(function()
        {
            self.previous();
        }).attr('id','wizardPrevButton');
        var skipButton = $('<div/>').html(_('Skip')).button().appendTo(this.$menu).click(function()
        {
            self.skip();
        }).attr('id','wizardSkipButton');
        var continueButton = $('<div/>').html(_('Continue')).button().appendTo(this.$menu).click(function()
        {
            if(self.getCurrentStep().isSkippable === false)
            {
                if(self.getFieldValue() == null)
                {
                    throw('getFieldValue returned null');
                }
            }
            self.next();
        }).attr('id','wizardContinueButton');

        $.subscribe('/wizard/displayStep',function(param)
        {
            if(param.step.isSkippable === false)
            {
                skipButton.hide();
            }
            else
            {
                skipButton.show();
            }
            if(param.step.type == 'selector')
            {
                continueButton.hide();
            }
            else
            {
                continueButton.show();
            }
            if(param.wizard.stack.length <= 0)
            {
                previousButton.hide();
            }
            else
            {
                previousButton.show();
            }
        });
    }
});
