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

var wizard = jClass({

    steps: [],

    runSteps: [],

    data: {},

    currStep: 0,

    currType: null,
    currDataKey: null,

    onDoneRun: null,


    _constructor: function (steps,onDone)
    {
        this.steps = steps;
        this.onDoneRun = onDone;
        this.prepContainer();
    },

    prepContainer: function ()
    {
    },

    // FIXME: Refactor the area so that the prompt content, title, and continue buttons
    //          are all separate
    newStep: function (data)
    {
        var info = $('<div/>');
        var title = '<b class="text">'+data.title+'</b>';
        var iContent = '<b class="text">'+data.title+'</b><hr />';
        if(data.information != '')
        {
            iContent += '<div class="text">'+data.information+'</div><br /><br /></div>';
        }

        var buildPart = $('<div/>');
        info.html(iContent);
        info.append(buildPart);
        info.append('<br />');

        var _self = this;
        var label = _('Continue');
        if(this.currStep >= (this.steps.length-1))
        {
            label = _('Finish');
        }
        var warningArea = $('<div/>').css({'font-weight':'bold'});
        warningArea.hide();
        info.append(warningArea);

        // FIXME: There is little point in regenerating this button on every single step
        var fwdButton = $('<div/>').html(label).button().mClick(function ()
        {
            if (_self.saveCurrent() == false)
            {
                warningArea.html(_('You must select a value')).fadeIn();
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
        fwdButton.attr('id','wizardContinueButton');
        info.append(fwdButton);

        if(this.currStep > 0)
        {
            var backButton = $('<div/>').html(_('Back')).button().mClick(function()
            {
                _self.back();
            }).attr('id','wizardBackButton');

            info.append(backButton);
        }
        info.append('<div style="clear:both;" />');
        UIWidgets.mainArea.transitionContent(info);

        return buildPart;
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
            this.selectorPrompt(area,d);
        }
        else if(d.type == 'text')
        {
            this.textPrompt(area,d);
        }
        else if(d.type == 'time')
        {
            this.timePrompt(area,d);
        }
        this.runSteps.unshift(step);
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
        if(val === '' || val === null || val === undefined)
            return false;

        this.data[this.currDataKey] = val;

        return true;
    },

    getStepValue: function ()
    {
        var type = this.currType,
            search = UIWidgets.mainArea.area;
        return this.getPromptValue(type,search);
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
        UIWidgets.mainArea.setContent('');
        if(this.onDoneRun)
            this.onDoneRun.call(null,this);
    },

    getPromptValue: function (type,search)
    {
        var val = null;
        if(type == 'selector')
        {
            val = search.find(':checked').val();
            if(val == 'true')
            {
                val = true;
            }
            else if(val == 'false')
            {
                val = false;
            }
        }
        else if(type == 'text')
        {
            val = search.find('input').val();
        }
        else if(type == 'time')
        {
            val = search.find('#hour').val()+':'+search.find('#minute').val();
        }
        else if(type == 'date')
        {
            val = $('#datePromptEntity').datepicker('getDate');
        }
        else
        {
            console.log('getPromptValue() got invalid type='+type);
        }
        return val;
    },

    selectorPrompt: function (area,data)
    {
        $.each(data.selections, function (int,setting)
        {

            var id = 'selectorPrompt_'+setting.val;
            if(area.attr('id'))
                id = id + '_'+area.attr('id');
            var html = '<input type="radio" name="radio" value="'+setting.val+'" id="'+id+'" /><label for="'+id+'">'+setting.label+'</label>';
            area.append(html);
            area.append('<br />');
        });
        area.find('[type=radio]').change(function()
        {
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

    textPrompt: function (area,data)
    {
        area.append(data.prompt);
        area.append('&nbsp;<input type="text" style="max-width: 100%; min-width:50%;" />');
    },

    datePrompt: function (area,data)
    {
        area.append(data.prompt);
        area.append('&nbsp;');
        $('<div />').attr('id','datePromptEntity').appendTo(area);
        $('#datePromptEntity').datepicker({
            // UI uses the international date format, but this isn't displayed,
            // and this will get us a parseable date.
            dateFormat: 'mm-dd-yyyy',
            dayNames: [_('Sunday'),_('Monday'),_('Tuesday'),_('Wednesday'),_('Thursday'),_('Friday'),_('Saturday')],
            dayNamesMin: [_('Su'),_('Mo'),_('Tu'),_('We'),_('Th'),_('Fr'),_('Sa')]
        });
        if(data.defaultDate)
        {
            $('#datePromptEntity').datepicker('setDate',data.defaultDate);
        }
    },

    timePrompt: function (area,data)
    {
        area.append(data.prompt);
        if($.browser.isNativeMobile)
        {
            area.append('<br />');
        }
        else
        {
            area.append('&nbsp;');
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
        area.append(h);
    },

    back: function()
    {
        if(this.runSteps.length > 1)
        {
            this.runSteps.shift();
            this.runStep(this.runSteps.shift() );
        }
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

var UI = 
{

    wizardDefinition: null,
    wizard: null,
    prompts: null,
    saveFunc: null,

    init: function (saveFunc)
    {
        if($.browser.isMobile)
            $('body').addClass('mobile');
        this.buildUI(saveFunc);
        this.saveFunc = saveFunc;
    },

    /*
     * Wizard UI bits
     */

    buildUI: function (saveFunc)
    {
        UIWidgets.tabBar(this);
        this.buildWizard(saveFunc);
        $(document).bind('keydown', 'ctrl+b', function () { UI.showDebugDialog(); });
    },

    buildWizard: function (saveFunc)
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
                        label: _('Light headache (able to function)')
                    },
                    {
                        val:'2',
                        label: _('Moderate headache (able to function, but somewhat difficuilt)')
                    },
                    {
                        val:'3',
                        label: _('Severe headache (unable to function)')
                    }
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
                }
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
                        label:_('4 hours or less')
                    },
                    {
                        val:'5',
                        label:_('5 hours')
                    },
                    {
                        val:'6',
                        label:_('6 hours')
                    },
                    {
                        val:'7',
                        label:_('7 hours')
                    },
                    {
                        val:'8',
                        label:_('8 hours')
                    },
                    {
                        val:'9',
                        label:_('9 hours')
                    },
                    {
                        val:'10',
                        label:_('10 hours')
                    },
                    {
                        val:'11',
                        label:_('11 hours')
                    },
                    {
                        val:'12+',
                        label:_('12 hours or more')
                    }
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
                        label:_('Less than 1 litre')
                    },
                    {
                        val:'1',
                        label:_('1 litre')
                    },
                    {
                        val:'1.5',
                        label:_('1.5 litre')
                    },
                    {
                        val:'2',
                        label:_('2 litre')
                    },
                    {
                        val:'2.5',
                        label:_('2.5 litre')
                    },
                    {
                        val:'3+',
                        label:_('3 litre or more')
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
            }
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
                        label:_('Yes')
                    },
                    {
                        val:false,
                        label:_('No')
                    },
                    {
                        val: 'na',
                        label:_('N/A (not female)')
                    }
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
        var myWizard = new wizard(wizardDefinition,saveFunc);
        window.wiz = myWizard;

        myWizard.run();

        this.prompts = this.wizard = myWizard;
    },

    /*
     * View/edit UI bits
     */
    buildViewTAB: function ()
    {
        var self = this;
        var headOrder = [ 'savedAt','start','intensity','medication','medEffect','sleep' ];
        if(diary.data.sex != 'male')
            headOrder.push('mens');
        var headMap = {
            'savedAt': {
                step: '',
                type: 'date',
                label: _('Date'),
                minHeight: 380,
                minWidth: 330,
                stepData: {
                    information: _('Select the date for this entry'),
                    type: 'date'
                }
            },
            'intensity': {
                step: 'intensity',
                type: 'intensity',
                label: _('Intensity')
            },
            'medication': {
                step: 'medication',
                type: 'bool',
                label: _('Took medication?'),
                postRun: function($col,value,entry)
                {
                    if(value == true)
                    {
                        $col.parents('tr').find('[value=medEffect]').mClick();
                    }
                    else
                    {
                        diary.data.savedData[entry].medEffect = null;
                        $col.parents('tr').find('[value=medEffect]').html('-');
                    }
                }
            },
            'medEffect': {
                step: 'medEffect',
                type: 'medEffect',
                label: _('Med. effect'),
                preCheck: function ($col)
                {
                    var ent = $col.parents('tr').attr('value');
                    var med = diary.data.savedData[ent].medication;
                    if(med == true)
                        return true;
                    return false;
                }
            },
            'sleep': { 
                step: 'sleep',
                type: 'int',
                label: _('Hours of sleep')
            },
            'start': {
                step: 'start',
                type: 'raw',
                label: _('Started at')
            },
            'mens': {
                step: 'mens',
                type: 'bool',
                label: _('Menstral period')
            }
        };

        var tab = $('#viewEntries').empty();
        var table = $('<table id="dataList"></table>').appendTo(tab);
        var topRow = $('<tr></tr>').appendTo(table);
        var headers = '';
        $.each(headOrder, function (i, val)
        {
            headers += '<th>'+headMap[val].label+'</th>';
        });
        headers += '<th>&nbsp;</th>';
        topRow.append(headers);
        $.each(diary.data.savedData, function (int,entry)
        {
            var row = $('<tr value="'+int+'"></tr>').appendTo(table);
            var content = '';
            $.each(headOrder, function (i, val)
            {
                var $td = $('<td />');
                $td.attr('value',val);
                $td.html(self.renderEntry(entry[val], headMap[val]));
                $td.appendTo(row);
            });
            $('<td value="delete" class="nopad"><span class="ui-icon ui-icon-trash"></span></td>').appendTo(row).mClick(function()
            {
                var $dialog = $('<div />').appendTo('body');
                var close = function ()
                {
                    $dialog.mDialog('close');
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
                $dialog.mDialog({
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
        $('td').mClick(function ()
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
        var data;

        // If type is 'delete' then it's the deletion column, which is
        // handled elsewhere
        if(type == 'delete')
            return;

        if(info.preCheck && !info.preCheck($col))
            return;

        if(info.stepData)
            data = info.stepData;
        else
            data = this.wizard.getStepByName(info.step);

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
            this.prompts.selectorPrompt($d,data);
        }
        else if(data.type == 'time')
        {
            this.prompts.timePrompt($d,data);
        }
        else if(data.type == 'text')
        {
            this.prompts.textPrompt($d,data);
        }
        else if(data.type == 'date')
        {
            this.prompts.datePrompt($d,data);
        }
        else
        {
            throw('Unknown step type: "'+data.type+'"');
        }
        var buttons = {};
        buttons[_('Save change')] = function ()
        {
            var value = self.prompts.getPromptValue(data.type,$d);
            $d.mDialog('close');
            $d.empty();
            if(data.type == 'date')
            {
                value = new Date(value);
                value = Math.round(value.getTime()/1000);
            }
            if(value === '' || value === null || value === undefined)
                return;
            var entry = $col.parents('tr').attr('value');
            diary.data.savedData[entry][type] = value;
            $col.html(self.renderEntry(value,info));
            diary.saveData();
            if (info.postRun)
                info.postRun($col,value,entry);
        };
        var dialogSettings = {
            minWidth: 400,
            minHeight: null,
            buttons: buttons
        };
        if (info.minHeight)
            dialogSettings.minHeight = info.minHeight;
        if(info.minWidth)
            dialogSettings.minWidth = info.minWidth;
        $d.mDialog(dialogSettings);
    },

    renderEntry: function(entry,data)
    {
        var type = data.type;
        var self = this;
        if(type == 'bool')
        {
            if(entry == true)
                return _('Yes');
            else
                return _('No');
        }
        else if (type == 'time' || type == 'date')
        {
            entry = parseInt(entry,10);
            if(entry > 1254329048)
            {
                try
                {
                    var dt = new Date(entry*1000);
                    var year = [ dt.getFullYear(), self.timePad(dt.getMonth()+1), self.timePad(dt.getDate()) ];
                    //var time = [ self.timePad(dt.getHours()), self.timePad(dt.getMinutes()) ];
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
                medium: _('Some'),
                good: _('Very good'),
                regressed: _('Good, but regressed')
            };
            if(entry == null || entry == '')
                return '-';
            if(effectMap[entry])
                return effectMap[entry];
            return '(unknown/unparseable)';
        }
        else if(type == 'raw')
        {
            return entry;
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
    },

    showDebugDialog: function ()
    {
        var info = [];
        info.push('migraineDiary version '+diary.version);
        info.push('Data version: '+diary.data.dataVersion);
        var language = window._LANGUAGE || navigator.language || navigator.browserLanguage;
        info.push('Language: '+language);
        var UALabel = 'User agent: ';
        if($.browser.isNativeMobile)
        {
            var edition = 'Native mobile edition running on ';
            if(navigator.userAgent.match(/Android/i))
            {
                edition = edition + 'Android'
            }
            else
            {
                edition = edition + '(unknown platform)';
            }
            info.push(edition);
            var devSize = 'Device size: ';
            $.each(['ldpi','mdpi','hdpi'], function(i,v)
            {
                if($('body').hasClass(v))
                {
                    devSize = devSize+v;
                }
            });
            if(devSize == 'Device size: ')
            {
                devSize = devSize + '(unknown)';
            }
            info.push(devSize);
            UALabel = 'Runtime: ';
        }
        else
        {
            info.push('Hosted at: '+document.domain);
        }
        info.push(UALabel+navigator.userAgent);
        info.push('Viewport size: '+$(window).width()+'x'+$(window).height());

        var buttons = {};
        buttons[_('Back')] = function () { $(this).mDialog('close'); };
        $('<div/>').html(info.join('<br />')).mDialog({
            buttons: buttons,
            minWidth: '400',
            title: 'migraineDiary debug dialog'
        });
    },

    showDatadumpDialog: function()
    {
        var data = $.toJSON(migraineDiary.data);
        var info = 'This is a dump of your raw diary data.<br /><textarea cols="50" rows="10">'+data+'</textarea>';
        var buttons = {};
        buttons[_('Back')] = function () { $(this).mDialog('close'); };
        $('<div/>').html(info).mDialog({
            buttons: buttons,
            minWidth: '400',
            title: 'migraineDiary data dump dialog'
        });
        
    },

    showAboutDialog: function()
    {
        var text = __('migraineDiary version %(VERSION)', { VERSION: diary.version } ) + '<br />' +
                   _('by Eskild Hustvedt') + '<br /><a href="http://www.zerodogg.org/" rel="external">http://www.zerodogg.org/</a><br /><br />'+
                   _('If you find migraineDiary useful, you\'re encouraged (but not required) to make a donation to help fund its development (<i>any</i> amount at all, big or small)'),
                   showDD, showData, buttons, dia, unbind;

        showDD = function()
        {
            $(document).unbind('keydown','b',showDD)
            $(document).unbind('keydown','d',showData)
            dia.mDialog('close');
            UI.showDebugDialog();
        };
        showData = function()
        {
            $(document).unbind('keydown','b',showDD)
            $(document).unbind('keydown','d',showData)
            dia.mDialog('close');
            UI.showDatadumpDialog();
        };
        $(document).bind('keydown', 'b', showDD);
        $(document).bind('keydown', 'd', showData);

        buttons = {};
        buttons[_('Back')] = function () {
            dia.mDialog('close');
            $(document).unbind('keydown','b',showDD)
            $(document).unbind('keydown','d',showData)
        };
        buttons[_('Donate')] = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HNBLQZLLE3GDU';

        dia = $('<div/>').html(text).mDialog({
            buttons: buttons,
            minWidth: '400',
            title: _('About migraineDiary')
        });
    },

    quickDialog: function (text,okLabel,title)
    {
        if(okLabel == null)
            okLabel = _('Back');
        var buttons = {};
        buttons[okLabel] = function () { $(this).mDialog('close'); };
        var params = {
            'buttons': buttons
        };
        if(title)
            params.title = title;
        $('<div/>').html(text).mDialog(params);
    }
};

var migraineDiary =
{
    UI: null,

    version: '0.1.1',
    confKey: 'org.zerodogg.migraineDiary',

    data: {
        dataVersion:1,
        savedData:[]
    },

    init: function()
    {
        this.loadData();
        this.runUI();
    },

    runUI: function ()
    {
        var self = this;
        if($.browser.msie && parseInt($.browser.version) < 8)
        {
            $('body').empty();
            $('body').html('You are running an ancient version of MSIE that does not work with the migraine diary.<br />We recommend that you upgrade to <a href="http://www.getfirefox.com/">Firefox</a>');
            return;
        }
        UI.init(function (wizard)
        {
            self.appendData(wizard.data);
            self.saveData();
            if($.browser.isNativeMobile)
            {
                $('#viewEntriesButton').mClick();
                UI.buildWizard(UI.saveFunc);
            }
            else
            {
                $('#addEntry').html(_('Done, data saved (locally in your browser).')+' <a href="#" id="learnMoreLocalStorage">'+_('Learn more about storage')+'.</a>');
                $('#learnMoreLocalStorage').click(function (e)
                {
                    e.preventDefault();
                    UI.quickDialog(_('All data saved by the Migraine Diary is saved locally in your browser. No data is sent to the server. This storage is permanent accross browser sessions, but if you explicitly delete "local storage" data from your browser, it will be permanently lost.'));
                    return false;
                });
            }
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
        try
        {
            try
            {
                // Sort the data before saving
                this.data.savedData = this.data.savedData.sort(function (a,b) { return b.savedAt - a.savedAt })
            } catch (e) { }
            $.jStorage.set(this.confKey, this.data);
        }
        catch(e)
        {
            var err = e.message;
            if(err == null)
                err = e;
            //var buttons = {};
            UI.quickDialog(_('A fatal error occurred while saving the data. Your data has probably not been saved.')+'<br /><br />Error:'+err);
        }
    }
};

$(function ()
{
    if($.browser.broken)
    {
        return;
    }
    $('title').text(_('Migraine Diary')+' beta');
    window.diary = migraineDiary;
    migraineDiary.init();
});
