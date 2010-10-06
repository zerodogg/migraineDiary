/*
 * migraineDiary.js
 * Copyright (C) Eskild Hustvedt 2010
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

jQuery.browser.isMobile = function ()
{
	return navigator.userAgent.match(/(Opera (Mi|Mo)|Android|Mobile)/);
};

var wizard = jClass({

	steps: [],

	data: {},

	currStep: 0,

	currType: null,
	currDataKey: null,

	onDoneRun: null,

	parent: null,

	_constructor: function (steps,onDone,parent)
	{
		this.steps = steps;
		this.onDoneRun = onDone;
		this.parent = parent;
		this.prepContainer();
	},

	prepContainer: function ()
	{
		this._container = $('<div/>').appendTo(this.parent).addClass('wizardContainer');
	},

	newStep: function (data)
	{
		var c = this._container;
		c.empty();
		var info = $('<div/>');
		var title = $('<b/>').html(data.title);
		info.append(title);
		info.append('<hr/>');
		if(data.information != '')
		{
			var infoText = $('<div/>');
			infoText.html(data.information);
			infoText.append('<br /><br />');
			info.append(infoText);
		}
		var buildPart = $('<div/>');
		info.append(buildPart);
		c.append(info);
		info.append('<br />');

		var _self = this;
		var label = _('Continue');
		if(this.currStep >= (this.steps.length-1))
		{
			label = _('Finish');
		}
		var warningArea = $('<div/>').css({float:'left', 'font-weight':'bold'});
		warningArea.hide();
		info.append(warningArea);

		var button = $('<div/>').html(label).button().click(function ()
		{
			if (_self.saveCurrent() == false)
			{
				warningArea.html('You must select a value').fadeIn();
				return false;
			}
			warningArea.fadeOut();
			if(data.onDone)
			{
				if(data.onDone.call(null,_self.data[_self.currDataKey],_self) == false)
					return false;
			}
			_self.nextStep();
		});
		button.attr('id','wizardContinueButton');

		info.append(button);
		info.append('<div style="clear:both;" />');

		return buildPart;
	},

	selectorStep: function (area,data)
	{
		$.each(data.selections, function (int,setting)
		{

            var id = 'selectorStep_'+setting.val;
            if(area.attr('id'))
                id = id + '_'+area.attr('id');
			var e = $('<input />');
			e.attr('type','radio');
			e.attr('name','radio');
			e.attr('value',setting.val);
			e.attr('id',id);
			area.append(e);
			var label = $('<label />');
			label.attr('for',id);
			label.html(setting.label);
			area.append(label);
			area.append('<br />');
		});
	},

	textFieldStep: function (area,data)
	{
		var e = $('<input type="text" />');
		e.css({maxWidth:'100%', minWidth: '50%'});
		area.append(data.prompt);
		area.append('&nbsp;');
		area.append(e);
	},

	timeSelectorStep: function (area,data)
	{
		area.append(data.prompt);
		area.append('&nbsp;');

        data = $.extend({ hour: 7, minute: 0}, data);

		var h = $('<select name="hour" id="hour"/>');
		for(var i = 0; i < 24; i++)
		{
			var opt = $('<option value="'+i+'" />');
			if(i == data.hour)
				opt.attr('selected','selected');
			opt.html(i);
			h.append(opt);
		}
		area.append(h);
		var m = $('<select name="minute" id="minute" />');
		$.each(['00','15','30','45'],function (e,i)
		{
			var opt = $('<option value="'+i+'" />');
			if(e == data.minute)
				opt.attr('selected','selected');
			opt.html(i);
			m.append(opt);
		});
		area.append(m);
	},

	run: function ()
	{
		this.runStep(0);
	},

	runStep: function (step)
	{
		this.currStep = step;

		var d = this.steps[step];

		this.currType = d.type;
		this.currDataKey = d.setting;

		var area = this.newStep(d);

		if(d.type == 'selector')
		{
			this.selectorStep(area,d);
		}
		else if(d.type == 'text')
		{
			this.textFieldStep(area,d);
		}
		else if(d.type == 'time')
		{
			this.timeSelectorStep(area,d);
		}
	},

	runNamedStep: function (name)
	{
        var step = this.getStepByName(name,true);
		if(step != null)
		{
			this.runStep(step);
		}
		else
		{
			throw('Unknown step identifier: '+name);
		}
	},

    getStepByName: function (name, wantsInt)
    {
        var step;
		$.each(this.steps, function(i,val)
		{
			if(val.setting == name)
			{
				step = i;
			}
		});

        if(wantsInt)
        {
            return step;
        }
        else
        {
            return this.steps[step];
        }
    },

	saveCurrent: function ()
	{
        var val = this.getStepValue(null,null);
		if(val == '' || val == null)
			return false;

		this.data[this.currDataKey] = val;

		return true;
	},

    getStepValue: function (type,search)
    {
        if (!type)
            type = this.currType;
        if (!search)
            search = this._container;
		var val = null;
		if(type == 'selector')
		{
			val = search.find('input:radio:checked').val();
		}
		else if(type == 'text')
		{
			val = search.find('input').val();
		}
		else if(type == 'time')
		{
			val = search.find('#hour').val()+':'+search.find('#minute').val();
		}
        return val;
    },

	nextStep: function ()
	{
		if( (this.currStep +1) > (this.steps.length -1))
		{
			this.done();
		}
		else
		{
			this.runStep( this.currStep+1 );
		}
	},

	done: function ()
	{
		this._container.empty();
		if(this.onDoneRun)
			this.onDoneRun.call(null,this);
	}

});

var widgets = {
    time: function (id)
    {
    },

    pulldown: function (id, selections)
    {
    }
};

var UI = jClass({

    wizardDefinition: null,
    wizard: null,

	_constructor: function (saveFunc)
	{
		if($.browser.isMobile())
			$('body').addClass('mobile');
		this.buildUI(saveFunc);
	},

    /*
     * Wizard UI bits
     */

	buildUI: function (saveFunc)
	{
        var self = this;
		var tabDiv = $('<div />');
		var tabBar = $('<ul />').append('<li><a href="#addEntry">'+_('Add entry')+'</a></li>')
								.append('<li><a href="#viewEntries">'+_('View entries')+'</a></li>');
		tabDiv.append(tabBar);
		tabDiv.append('<div id="addEntry"></div>');
		tabDiv.append('<div id="viewEntries">View entries tab</div>');
		$('body').append(tabDiv);
        tabDiv.tabs({
            show: function (event,UI)
            {
                if(UI.index == 1)
                    self.buildViewTAB();
            },
        });

		this.buildWizard(saveFunc,$('#addEntry'));
	},

	buildWizard: function (saveFunc, parent)
	{
		var wizardDefinition =  [
			{
				type: 'selector',
				setting: 'intensity',
				title: _('Migraine intensity'),
				information: _('How intense was the migraine?'),
				selections:
				[
					{
						val:'1',
						label: _('Light headache (able to function)'),
					},
					{
						val:'2',
						label: _('Moderate headache (able to function, but somewhat difficuilt)')
					},
					{
						val:'3',
						label: _('Severe headache (unable to function)')
					},
				]
			},

			{
				type: 'time',
				setting: 'start',
				title: _('Started'),
				information: '',
				prompt: _('When did the migraine start?')
			},

			{
				type: 'selector',
				setting: 'medication',
				title: _('Medication'),
				information: _('Did you take any medication?'),
				selections:
				[
					{
						val:true,
						label:_('Yes')
					},
					{
						val:false,
						label:_('No')
					}
				],
				onDone: function (value,wizard)
				{
					if(value == true)
						return true;
					wizard.runNamedStep('sleep');
					return false;
				},
			},

			{
				type: 'selector',
				setting: 'medEffect',
				title: _('Medication (effect)'),
				information: _('What effect did the medication have?'),
				selections:
				[
					{
						val:'none',
						label:_('None')
					},
					{
						val:'medium',
						label:_('Some')
					},
					{
						val:'good',
						label:_('Very good')
					},
					{
						val:'regressed',
						label:_('Good, but regressed')
					}
				]
			},

			{
				type: 'selector',
				setting: 'sleep',
				title: _('Sleep'),
				information: _('Approx. how long did you sleep last night?'),
				changeInformation: _('Approx. how long did you sleep?'),
				selections:
				[
					{
						val:'4-',
						label:_('4 hours or less'),
					},
					{
						val:'5',
						label:_('5 hours'),
					},
					{
						val:'6',
						label:_('6 hours'),
					},
					{
						val:'7',
						label:_('7 hours'),
					},
					{
						val:'8',
						label:_('8 hours'),
					},
					{
						val:'9',
						label:_('9 hours'),
					},
					{
						val:'10',
						label:_('10 hours'),
					},
					{
						val:'11',
						label:_('11 hours'),
					},
					{
						val:'12+',
						label:_('12 hours or more'),
					},
				]
			},

			{
				type: 'selector',
				setting: 'drink',
				title: _('Drink'),
				information: _('Approx. how much have you had to drink today?'),
				changeInformation: _('Approx. how much have you had to drink?'),
				selections:
				[
					{
						val:'1-',
						label:_('Less than 1 litre'),
					},
					{
						val:'1',
						label:_('1 litre'),
					},
					{
						val:'1.5',
						label:_('1.5 litre'),
					},
					{
						val:'2',
						label:_('2 litre'),
					},
					{
						val:'2.5',
						label:_('2.5 litre'),
					},
					{
						val:'3+',
						label:_('3 litre or more'),
					}
				],
				onDone: function(value,wizard) 
				{
					if(diary.data.sex == 'male')
					{
						wizard.done();
						return false;
					}
					return true;
				}
			},
		];

	if(diary.data.sex != 'male')
	{
		wizardDefinition.push({
				type: 'selector',
				setting: 'mens',
				title: _('Menstral period'),
				information: _('Did you have your menstral period?'),
				selections:
				[
					{
						val:true,
						label:_('Yes'),
					},
					{
						val:false,
						label:_('No'),
					},
					{
						val: 'na',
						label:_('N/A (not female)'),
					},
				],
				onDone: function(value,wizard) 
				{
					if(value == 'na')
					{
						diary.data.sex = 'male';
					}
					return true;
				}
			});
		}
        this.wizardDefinition = wizardDefinition;
		var myWizard = new wizard(wizardDefinition,saveFunc,parent);

		myWizard.run();

        this.wizard = myWizard;
	},

    /*
     * View/edit UI bits
     */
    buildViewTAB: function ()
    {
        var self = this;
        var headOrder = [ 'savedAt','intensity','medication','medEffect','sleep','start' ];
        var headMap = {
            'savedAt': {
                step: '',
                type: 'date',
                label: _('Date')
            },
            'intensity': {
                step: 'intensity',
                type: 'intensity',
                label: _('Intensity')
            },
            'medication': {
                step: 'medication',
                type: 'bool',
                label: _('Took medication?')
            },
            'medEffect': {
                step: 'medEffect',
                type: 'medEffect',
                label: _('Med. effect')
            },
            'sleep': { 
                step: 'sleep',
                type: 'int',
                label: _('Hours of sleep')
            },
            'start': {
                step: 'start',
                type: 'time',
                label: _('Started at')
            }
        };

        var tab = $('#viewEntries').empty();
        var table = $('<table id="dataList"></table>').appendTo(tab);
        var topRow = $('<tr></tr>').appendTo(table);
        $.each(headOrder, function (i, val)
        {
            $('<th>'+headMap[val].label+'</th>').appendTo(topRow);
        });
        $('<th>&nbsp;</th>').appendTo(topRow);
        $.each(diary.data.savedData, function (int,entry)
        {
            var row = $('<tr value="'+int+'"></tr>').appendTo(table);
            $.each(headOrder, function (i, val)
            {
                var $td = $('<td />');
                $td.attr('value',val);
                $td.html(self.renderEntry(entry[val], headMap[val]));
                $td.appendTo(row);
            });
            $('<td><span class="ui-icon ui-icon-trash"></span></td>').appendTo(row).click(function()
            {
                var $dialog = $('<div />').appendTo('body');
                var close = function ()
                {
                    $dialog.dialog('close');
                    $dialog.remove();
                };
                var buttons = {};
                buttons[_('Yes')] = function ()
                {
                    close();
                    diary.data.savedData.splice(int,1);
                    diary.saveData();
                    self.buildViewTAB();
                };
                buttons[_('No')] = close;
                $dialog.html(_('Are you sure you want to <b>permanently</b> delete this entry?'));
                $dialog.dialog({
                    close: false,
                    buttons: buttons
                });
            });
        });
        var columnClick = function ()
        {
            var me = $(this);
            var val = me.text();
            var input = $('<input type="text" />').val(val);
            var blur = function ()
            {
                val = input.val();
                me.html(val);
                me.addClass('columnValue');
                me.click(columnClick);
            };
            input.blur(blur);
            input.submit(blur);
            me.removeClass('columnValue');
            me.unbind('click');
            me.html(input);
            input.keypress(function (event)
            {
                if (event.which == 13)
                    input.trigger('blur');
            });
            input.focus();
            input.select();
        };
        $('td').click(function ()
        {
            self.columnEditor(this, headMap);
        });
    },

    columnEditor: function (column, map)
    {
        var self = this;
        var $d = $('#columnDialog');
        if ($d.length == 0)
        {
            $d = $('<div/>').attr('id','columnDialog').appendTo('body');
        }
        $d.empty();
        var $col = $(column);
        var type = $col.attr('value');
        var info = map[type];
        var data = this.wizard.getStepByName(info.step);
        if(data.changeInformation)
        {
            $d.append(data.changeInformation+ '<br />');
        }
        else if(data.information)
        {
            $d.append(data.information + '<br />');
        }
        if(data.type == 'selector')
        {
            this.wizard.selectorStep($d,data);
        }
        else if(data.type == 'time')
        {
            this.wizard.timeSelectorStep($d,data);
        }
        else if(data.type == 'text')
        {
            this.wizard.textFieldStep($d,data);
        }
        else
        {
            throw('Unknown stepType: "'+info.stepType+'"');
        }
        var buttons = {};
        buttons[_('Save change')] = function ()
        {
            var value = self.wizard.getStepValue(info.stepType,$d);
            $d.dialog('close');
            $d.empty();
            if(value == '' || value == null)
                return;
            var entry = $col.parents('tr').attr('value');
            diary.data.savedData[entry][type] = value;
            $col.html(self.renderEntry(value,info));
            diary.saveData();
        };
        $d.dialog({
            minWidth: 400,
            buttons: buttons
        });
    },

    renderEntry: function(entry,data)
    {
        var type = data.type;
        if(entry == null || entry == '')
            return '&nbsp';
        var self = this;
        if(type == 'bool')
        {
            if(entry == true || entry == 'true')
                return _('Yes');
            else
                return _('No');
        }
        else if (type == 'time' || type == 'date')
        {
            entry = parseInt(entry);
            if(entry > 1254329048)
            {
                try
                {
                    var dt = new Date(entry*1000);
                    var year = [ dt.getFullYear(), self.timePad(dt.getMonth()), self.timePad(dt.getDate()) ];
                    var time = [ self.timePad(dt.getHours()), self.timePad(dt.getMinutes()) ];
                    var val = year.join('-'); // + ' ' + time.join(':');
                    return val;
                }
                catch(e)
                {
                    console.log(e);
                    return '(failed to parse date "'+entry+'")';
                }
            }
            else
            {
                return entry;
            }
        }
        else if(type == 'int')
        {
            if(data.postfix)
                entry = entry+' '+data.postfix;
            return entry;
        }
        else if(type == 'intensity')
        {
            var intenseMap = [];
            intenseMap[1] = _('Light');
            intenseMap[2] = _('Moderate');
            intenseMap[3] = _('Severe');
            if(intenseMap[entry])
                return intenseMap[entry];
            return '(unknown/unparseable)';
        }
        else if(type == 'medEffect')
        {
            var effectMap = {
                none: _('None'),
                some: _('Some'),
                good: _('Very good'),
                regressed: _('Good, but regressed')
            };
            if(type == null)
                return '-';
            if(effectMap[entry])
                return effectMap[entry];
            return '(unknown/unparseable)';
        }
        console.log('Unknown type: '+type);
        return entry;
    },

    timePad: function (val)
    {
        val = new String(val);
        if(val.length == 1)
            return '0'+val;
        return val;
    }
});

var migraineDiary = jClass({
	UI: null,

	confKey: 'org.zerodogg.migraineDiary',

	data: {
		dataVersion:1,
		savedData:[]
	},

	_constructor: function ()
	{
		this.loadData();
	},

	runUI: function ()
	{
		var self = this;
		this.UI = new UI(function (wizard)
		{
			self.appendData(wizard.data);
			self.saveData();
			$('#addEntry').html(_('Done, data saved (locally).'));
		});
	},

	appendData: function (data)
	{
		// Unix timestamp
		data.savedAt = Math.round(new Date().getTime() / 1000);

		this.data.savedData.push(data);
	},

	loadData: function ()
	{
		var data = $.jStorage.get(this.confKey);
		if(data)
		{
			this.data = data;
		}
	},

	saveData: function ()
	{
		$.jStorage.set(this.confKey, this.data);
	}
});

var diary;

$(function ()
{
	diary = new migraineDiary();
	diary.runUI();
});
