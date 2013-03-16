var questionRenderer = jClass.virtual({
    $target: null,

    _constructor: function(params)
    {
        if (!params.target)
        {
            throw('Missing either target parameter to questionRenderer subclass');
        }
        this.$target = $(params.target);
    },

    renderField: function(field)
    {
        if(field == null)
        {
            throw('renderField: got null parameter as field');
        }
        this.clearCurrent();
        var renderers = {
            time        : this.renderTime,
            selector    : this.renderSelector,
            multiSelect : this.renderMultiSelector
        };
        if(this.mode && this.mode == 'standalone')
        {
            this.fieldData = field;
        }
        var current = this.getCurrentStep();
        this.setTitle(current.title);
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
            throw('renderField: Unknown or unsupported field type: '+field.type);
        }
    },

    getFieldValue: function()
    {
        var field = this.getCurrentStep();
        var getters = {
            time        : this.getTime,
            selector    : this.getSelector,
            multiSelect : this.getMultiSelect
        };
        if(getters[field.type])
        {
            return getters[field.type].apply(this,arguments);
        }
        else
        {
            throw('getFieldValue: Unknown or unsupported field type: '+field.type);
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

    getMultiSelect: function()
    {
        var values = [];
        this.$target.find(':checked').each(function()
        {
            var $this = $(this);
            values.push($this.val());
        });
        return values;
    },

    renderTime: function(data)
    {
        this.$target.append(data.prompt);
        if(NATIVE_MOBILE)
        {
            this.$target.append('<br />');
        }
        else
        {
            this.$target.append('&nbsp;');
        }

        var settings = { hour: 7, minute: 0, minHour: 0, minMinute: 0 };
        this.publish('renderStep', { 'step': data, 'settings':settings });

        data = $.extend(settings, data);

        var h = '<select name="hour" id="hour" >';
        for(var i = 0; i < 24; i++)
        {
            if(data.minHour > i)
            {
                continue;
            }
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
        if(data.minHour > 0 || data.minMinute > 0)
        {
            h += '<input type="hidden" value="'+data.minHour+':'+data.minMinute+'" id="timeMinData" />';
        }
        this.$target.append(h);
    },

    renderSelector: function(data)
    {
        var self = this;
        this.publish('renderStep', { 'step': data });
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

    renderMultiSelector: function(data)
    {
        var self = this;
        this.publish('renderStep', { 'step': data });
        $.each(data.selections, function (int,setting)
        {
            var id = 'selectorPrompt_'+setting.val;
            if(self.$target.attr('id'))
                id = id + '_'+self.$target.attr('id');
            var html = '<input type="checkbox" name="checkbox" value="'+setting.val+'" id="'+id+'" /><label for="'+id+'">'+setting.label+'</label>';
            self.$target.append(html);
            self.$target.append('<br />');
        });
        /*
        var self = this;
        this.$target.find('[type=radio]').change(function()
        {
            self.next();
        });*/
    },

    clearCurrent: function()
    {
        if(this.$target)
        {
            this.$target.html('');
        }
    }
});

/*
 * This is a standalone subclass of questionRenderer. It implements generic
 * versions of methods that questionRenderer expects to be there from the
 * wizard class to enable it to work without a full-blown wizard.
 */
var standaloneQuestions = jClass.extend(questionRenderer,{
    /* mode is used to indicate to the questionRenderer that it needs to store
     * the field data in our fieldData attribute */
    mode: 'standalone',
    /* These are safe to leave as noops */
    next: $.noop,
    prev: $.noop,
    publish: $.noop, // FIXME
    setTitle: $.noop,
    /* This is used to store the currently rendered field */
    fieldData: null,
    /* This is a small method that will just return fieldData */
    getCurrentStep: function()
    {
        return this.fieldData;
    }
});
