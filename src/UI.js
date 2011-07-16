var UI = {
    wizard: null,

    steps:
    {
        _meta: {
            apiversion: 0,
            defaultOrder: ['startTime','intensity','endTime','medication','medEffect','sleep','drink','menstalPeriod'],
        },
        'intensity': {
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
            type: 'time',
            setting: 'start',
            isSkippable: false,
            title: _('Started'),
            information: '',
            prompt: _('When did the migraine start?')
        },

        'endTime': {
            type: 'time',
            isSkippable: false,
            title: _('Ended'),
            information: '',
            prompt: _('When did the migraine end?')
        },

        'medication': {
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
        'menstalPeriod':{
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
        }
    },

    init: function ()
    {
        if($.browser.isMobile)
            $('body').addClass('mobile');
        UIWidgets.tabBar(this);
        this.initWizard();
    },

    initWizard: function()
    {
        if (! $('#addEntry'))
        {
            $('<div/>').attr('id','addEntry').appendTo('body').addClass('wizardContainer');
        }
        $('#addEntry').addClass('wizardContainer'); // FIXME
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
