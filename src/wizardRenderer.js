var jqWizard = jClass.extend(wizard,{
    $target: null,

    _constructor: function(params)
    {
        this.$target = $(params.target);
        this.$menu   = $(params.menu);
    },

    renderField: function(field)
    {
        this.clearCurrent();
        var renderers = {
            time     : 'renderTime',
            selector : 'renderSelector'
        };
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
        var getters = {
            time     : 'getTime',
            selector : 'getSelector'
        };
        if(getters[field.type])
        {
            getters[field.type].apply(this,arguments);
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

    renderSelector: function()
    {
        $.each(data.selections, function (int,setting)
        {

            var id = 'selectorPrompt_'+setting.val;
            if(this.$target.attr('id'))
                id = id + '_'+this.$target.attr('id');
            var html = '<input type="radio" name="radio" value="'+setting.val+'" id="'+id+'" /><label for="'+id+'">'+setting.label+'</label>';
            this.$target.append(html);
            this.$target.append('<br />');
        });
        this.$target.find('[type=radio]').change(function()
        {
            // FIXME
            if($('#wizardContinueButton').is(':visible'))
            {
                $('#wizardContinueButton').mClick();
            }
            else
            {
                $('#columnDialog').find('.ui-button').mClick();
            }
        });
    },

    clearCurrent: function()
    {
        this.$target.html('');
    }
});
