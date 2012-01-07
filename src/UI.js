/*
 * Platform-independant UI components for migraineDiary.
 *
 * This file contains the UI class, which builds most of the migraineDiary
 * UI, and hooks into the various back-end methods. It depends upon an
 * implementation of the UIWidgets class. For browsers the implementation
 * is small, and can be found in browser/uiwrap.js - for mobile devices
 * it's quite a bit larger to build an interface more suited to mobile
 * devices, it's in mobile/uiwrap.js
 */
var UI = {
    // Reference to the primary wizard class that is in use
    wizard: null,

    // Wizard step definition
    steps:
    {
        _meta: {
            apiversion: 0,
            defaultOrder: ['startTime','intensity','endTime','medication','medEffect','sleep','drink','menstralPeriod'],
        },
        /* Wizard+edit steps */
        'intensity': {
                label: _('Intensity'),
                type: 'selector',
                setting: 'intensity',
                isSkippable: false,
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
        'startTime': {
            label: _('Started at'),
            type: 'time',
            setting: 'startTime',
            isSkippable: false,
            title: _('Started'),
            information: '',
            prompt: _('When did the migraine start?')
        },

        // We also use a subscriber to the /wizard/renderStep event
        // to ensure that endTime > startTime
        'endTime': {
            label: _('Ended at'),
            type: 'time',
            setting: 'endTime',
            isSkippable: false,
            title: _('Ended'),
            information: '',
            prompt: _('When did the migraine end?')
        },

        'medication': {
            label: _('Took medication?'),
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
            onDone: function (wizard,value)
            {
                if(value != true)
                {
                    wizard.addIgnoredStep('medEffect');
                }
                else
                {
                    wizard.removeIgnoredStep('medEffect');
                }
            }
        },

        'medEffect': {
            label: _('Med. effect'),
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

        'sleep': {
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

        'drink':{
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
            onDone: function(wizard,value) 
            {
                if(diary.data.sex == 'male')
                {
                    wizard.done();
                    return false;
                }
                return true;
            }
        },
        'menstralPeriod':{
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
        },
        /* Edit-only steps.
         * These are not run during the wizard, though they can be viewed using it
         * (with the exception of "duration", which is a generated value). */
        'savedAt': {
            setting: 'savedAt',
            information: _('Select the date for this entry'),
            label: _('Date'),
            type: 'date',
        },
        'duration': {
            setting: 'duration',
            label: _('Duration'),
            type: 'meta',
        }
    },

    // Main app UI initialization
    init: function ()
    {
        if($.browser.isMobile)
            $('body').addClass('mobile');
        UIWidgets.tabBar(this);
        this.initSubscriptions();
        this.initWizard();
    },

    /* Initializes pub/sub subscriptions */
    initSubscriptions: function()
    {
        var self = this;
        $.subscribe('/wizard/renderStep',function(data)
        {
            if(data.step.setting == 'endTime')
            {
                var start = data.wizard.data.startTime.split(':');
                mLog(start[0]+1);
                $.extend(data.settings,{
                    // FIXME: Blindly setting hour to start +1
                    hour: parseInt(start[0],10)+1,
                    minute: '00',
                    minHour: start[0],
                    minMinute: start[1]
                });
            }
        });
        $.subscribe('/wizard/done',function(data)
        {
            var start = data.wizard.data.startTime.split(':');
            var end = data.wizard.data.endTime.split(':');
            var startH = ( parseInt(start[0],10)*60 ) + parseInt(start[1]);
            var endH   = ( parseInt(end[0],10) * 60) + parseInt(end[1]);
            var duration = (endH - startH)/60;
            var hours = parseInt(duration,10);
            duration = duration-hours;
            var minutes = duration*60;
            data.wizard.data.duration = self.timePad(hours)+':'+self.timePad(minutes);
            diary.saveData();
        });
    },

    /* Initializes the wizard */
    initWizard: function()
    {
        if (! $('#addEntry'))
        {
            $('<div/>').attr('id','addEntry').appendTo('body').addClass('wizardContainer');
        }
        // FIXME empty addEntry
        var target = $('<div />').appendTo('#addEntry').attr('id','wizardContent');
        var menu = $('<div />').appendTo('#addEntry').attr('id','wizardButtons');
        this.wizard = new jqWizard({
            steps: this.steps,
            target: target,
            menu: menu
        });
        this.wizard.next();
    },

    /* Shows a debug dialog */
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

    /* Shows a data dump for the user, if they want to copy or view the raw data */
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

    /* Shows a simple about dialog */
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
    },

    buildViewTAB: function()
    {
        var self = this;

        var headOrder = [ 'savedAt','startTime','endTime','duration','medication','medEffect','sleep','drink','menstralPeriod' ]; // FIXME: menstralPeriod needs checking

        var headMap = $.extend({},this.steps);
        headMap['medication'].postRun = function($col,value,entry)
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
        };

        var tab = $('#viewEntries').empty();
        var table = $('<table id="dataList"></table>').appendTo(tab);
        var topRow = $('<tr></tr>').appendTo(table);
        var headers = '';
        $.each(headOrder, function (i, val)
        {
            var label = headMap[val].label;
            if(label == null)
            {
                label = headMap[val].title;
            }
            headers += '<th>'+label+'</th>';
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

    renderEntry: function(entry,data)
    {
        var type = data.type;
        var self = this;
        if(data === undefined)
        {
            return '-';
        }
        if(type == 'selector')
        {
            var value = this.getHashFromArrayByVal(data.selections, 'val', entry);
            if(value === undefined)
            {
                var fallback = this.fallbackEntry(entry);
                var err = 'Failed to locate value "'+entry+'" for selector '+data.setting;
                if(fallback !== undefined)
                {
                    entry = fallback;
                }
                this._renderError(entry,data,'locate',fallback);
                return entry;
            }
            if(value.shortLabel)
            {
                return value.shortLabel;
            }
            else
            {
                return value.label;
            }
        }
        else if (type == 'date')
        {
            var parsed = parseInt(entry,10);
            if (isNaN(parsed))
            {
                this._renderError(entry,data,'parse int');
                return '-';
            }
            entry = parsed;
            if(entry > 1254329048)
            {
                try
                {
                    var dt = new Date(entry*1000);
                    var year = [ dt.getFullYear(), self.timePad(dt.getMonth()+1), self.timePad(dt.getDate()) ];
                    var val = year.join('-');
                    return val;
                }
                catch(e)
                {
                    mLog(e);
                    return '(failed to parse date "'+entry+'")';
                }
            }
            else
            {
                return entry;
            }
        }
        else if(type == 'raw' || type == 'time')
        {
            return entry;
        }
        mLog('Unknown type: '+type);
        return entry;
    },

    _renderError: function(entry,data,type,fallback)
    {
        if(data.setting === undefined)
        {
            mLog('Confused, no selector for entry: ',data);
        }
        var err = 'Failed to '+type+' value "'+entry+'" for selector '+data.setting;
        if(fallback !== undefined && fallback !== entry)
        {
            err = err + ' - will use fallback value: '+fallback;
        }
        mLog(err);
    },

    getHashFromArrayByVal: function(arr,key,val)
    {
        var ret;
        $.each(arr, function(i,e)
        {
            if(e[key] !== undefined && e[key] == val)
            {
                ret = e;
            }
        });
        return ret;
    },

    fallbackEntry: function(entry)
    {
        if(entry === undefined)
        {
            return '-';
        }
        else if(entry === true || entry === 'true')
        {
            return _('Yes');
        }
        else if(entry === false || entry === 'false')
        {
            return _('No');
        }
        return entry;
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
        var renderer = new standaloneQuestions({
            target: $d
        });
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
        {
            data = info.stepData;
        }
        else
        {
            data = this.wizard.getStepByName(type);
        }

        if(data.changeInformation)
        {
            $d.append(data.changeInformation+ '<br />');
        }
        else if(data.information)
        {
            $d.append(data.information + '<br />');
        }
        if(data.type == 'meta')
        {
            return;
        }
        renderer.renderField(data);
        var buttons = {};
        buttons[_('Save change')] = function ()
        {
            var value = renderer.getFieldValue();
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

    timePad: function (val)
    {
        val = ""+val;
        if(val.length == 1)
            return '0'+val;
        return val;
    },
};
