var jqWizard = jClass.extend(wizard,{
    $target: null,

    _constructor: function(params)
    {
        if (!params.target || !params.menu)
        {
            throw('Missing either target and/or menu parameters to jqWizard');
        }
        this.$target = $(params.target);
        this.$menu   = $(params.menu);
        this.buildMenu();
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
    },

    renderField: function(field)
    {
        this.clearCurrent();
        var renderers = {
            time     : this.renderTime,
            selector : this.renderSelector
        };
        $('<b/>').text( this.getCurrentStep().title ).appendTo(this.$target).addClass('wizardTitle');
        $('<hr/>').appendTo(this.$target);
        $('<br/>').appendTo(this.$target);
        if(field.information)
        {
            $('<div/>').text(field.information).appendTo(this.$target).addClass('wizardInformation');
        }
        if(renderers[field.type])
        {
            renderers[field.type].apply(this,arguments);
        }
        else
        {
            throw('Unknown or unsupported field type: '+field.type);
        }
    },

    getFieldValue: function()
    {
        var field = this.getCurrentStep();
        var getters = {
            time     : this.getTime,
            selector : this.getSelector
        };
        if(getters[field.type])
        {
            return getters[field.type].apply(this,arguments);
        }
        else
        {
            throw('Unknown or unsupported field type: '+field.type);
        }
    },

    getTime: function()
    {
        return this.$target.find('#hour').val()+':'+this.$target.find('#minute').val();
    },

    getSelector: function()
    {
        var val = this.$target.find(':checked').val();
        if(val == 'true')
        {
            val = true;
        }
        else if(val == 'false')
        {
            val = false;
        }
        return val;
    },

    renderTime: function(data)
    {
        this.$target.append(data.prompt);
        if($.browser.isNativeMobile)
        {
            this.$target.append('<br />');
        }
        else
        {
            this.$target.append('&nbsp;');
        }

        data = $.extend({ hour: 7, minute: 0}, data);

        var h = '<select name="hour" id="hour" >';
        for(var i = 0; i < 24; i++)
        {
            h += '<option value="'+i+'" ';
            if(i == data.hour)
                h += 'selected="selected" ';
            h += '>'+i+'</option>';
        }
        h += '</select>';
        h += '<select name="minute" id="minute">';
        $.each(['00','15','30','45'],function (e,i)
        {
            h += '<option value="'+i+'"';
            if(e == data.minute)
                h += ' selected="selected"';
            h += ' >'+i+'</option>';
        });
        h += '</select>';
        this.$target.append(h);
    },

    renderSelector: function(data)
    {
        var self = this;
        $.each(data.selections, function (int,setting)
        {

            var id = 'selectorPrompt_'+setting.val;
            if(self.$target.attr('id'))
                id = id + '_'+self.$target.attr('id');
            var html = '<input type="radio" name="radio" value="'+setting.val+'" id="'+id+'" /><label for="'+id+'">'+setting.label+'</label>';
            self.$target.append(html);
            self.$target.append('<br />');
        });
        var self = this;
        this.$target.find('[type=radio]').change(function()
        {
            self.next();
        });
    },

    clearCurrent: function()
    {
        this.$target.html('');
    }
});
