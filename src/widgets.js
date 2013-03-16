var widgets = {
    screen: jClass({
        _content: null,
        _element: null,
        _constructor: function(content)
        {
            this._element = $('<div />');
            this.content(content);
        },
        content: function(set)
        {
            if(set)
            {
                this._element.html(set);
                return this;
            }
            return this._content;
        },
        show: function()
        {
            $('body').empty();
            this._element.appendTo('body');
            return this;
        },
        hide: function()
        {
            this._element.hide();
            return this;
        }
    }),
    dialog: jClass({
        _constructor: function()
        {
        },
        show: function()
        {
        },
        hide: function()
        {
        }
    }),
    button: jClass({
    })
};
