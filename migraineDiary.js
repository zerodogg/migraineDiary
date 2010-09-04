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
			var e = $('<input />');
			e.attr('type','radio');
			e.attr('name','radio');
			e.attr('value',setting.val);
			e.attr('id',setting.val);
			area.append(e);
			var label = $('<label />');
			label.attr('for',setting.val);
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

		var h = $('<select name="hour" id="hour"/>');
		for(var i = 0; i < 24; i++)
		{
			var opt = $('<option value="'+i+'" />');
			if(i == 7)
				opt.attr('selected','selected');
			opt.html(i);
			h.append(opt);
		}
		area.append(h);
		var m = $('<select name="minute" id="minute" />');
		$.each(['00','15','30','45'],function (e,i)
		{
			var opt = $('<option value="'+i+'" />');
			if(e == 0)
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
		var step;
		$.each(this.steps, function(i,val)
		{
			if(val.setting == name)
			{
				step = i;
			}
		});
		if(step != null)
		{
			this.runStep(step);
		}
		else
		{
			throw('Unknown step identifier: '+name);
		}
	},

	saveCurrent: function ()
	{
		var val = null;
		if(this.currType == 'selector')
		{
			val = this._container.find('input:radio:checked').val();
		}
		else if(this.currType == 'text')
		{
			val = this._container.find('input').val();
		}
		else if(this.currType == 'time')
		{
			val = this._container.find('#hour').val()+':'+this._container.find('#minute').val();
		}

		if(val == '' || val == null)
			return false;

		this.data[this.currDataKey] = val;

		return true;
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

var UI = jClass({
	_constructor: function (saveFunc)
	{
		if($.browser.isMobile())
			$('body').addClass('mobile');
		this.buildUI(saveFunc);
	},

	buildUI: function (saveFunc)
	{
		var tabDiv = $('<div />');
		var tabBar = $('<ul />').append('<li><a href="#addEntry">'+_('Add entry')+'</a></li>')
								.append('<li><a href="#viewEntries">'+_('View entries')+'</a></li>');
		tabDiv.append(tabBar);
		tabDiv.append('<div id="addEntry"></div>');
		tabDiv.append('<div id="viewEntries">View entries tab</div>');
		$('body').append(tabDiv);
		tabDiv.tabs();

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
		var myWizard = new wizard(wizardDefinition,saveFunc,parent);

		myWizard.run();

	},
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
			$('body').html(_('Done, data saved (locally).'));
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
