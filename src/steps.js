/*
 * See wizard.js for information about the syntax of this file
 */
UI.steps = {
        _meta: {
            apiversion: 0,
            defaultOrder: ['startTime','intensity','painLocation','symptoms','endTime','auraSigns','triggers'],
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

        'painLocation': {
            title: _('Pain location'),
            label: _('Pain location'),
            prompt: _('Where was the pain located?'),
            setting: 'painLocation',
            information:'',
            type: 'multiSelect',
            selections:
            [
                {
                    val: 'headLeft',
                    label: _('Left side')
                },
                {
                    val: 'headRight',
                    label: _('Right side')
                },
                {
                    val: 'neck',
                    label: _('The neck region')
                },
                {
                    val: 'changedSide',
                    label: _('Changed side during the attack')
                }
            ]
        },

        'auraSigns': {
            title: _('Aura signs'),
            label: _('Aura signs'),
            prompt: _('If you have an aura-migraine, did you have any of the following signs?'),
            setting: 'auraSigns',
            information:'',
            type: 'multiSelect',
            selections:
            [
                {
                    val: 'disturbedVision',
                    label: _('Vision-disturbances'),
                },
                {
                    val: 'disturbedSpeech',
                    label: _('Speech-disturbances'),
                },
                {
                    val: 'numbness',
                    label: _('Numbness'),
                }
            ]
        },

        'symptoms': {
            title: _('Symptoms'),
            label: _('Symptoms'),
            prompt: _('Select any symptoms you experienced'),
            information: '',
            type: 'multiSelect',
            selections:
            [
                {
                    val: 'nausia',
                    label: _('Nausia')
                },
                {
                    val: 'vomit',
                    label: _('Vomiting')
                },
                {
                    val: 'lightShy',
                    label: _('Light shyness'),
                },
                {
                    val: 'soundShy',
                    label: _('Sound shyness'),
                },
                {
                    val: 'worseningOnExertion',
                    label: _('Worsening on physical exertion')
                }
            ]
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
        'triggers': {
            title: _('Triggers'),
            label: _('Triggers'),
            prompt: _('Select anything you think contributed to triggering your migraine'),
            setting: 'triggers',
            type: 'multiSelect',
            selections:
            [
                {
                    val: 'stress',
                    label: _('Stress'),
                },
                {
                    val: 'tooLittleFood',
                    label: _('Ate too little'),
                },
                {
                    val: 'foodOrSnacks',
                    label: _('Food or snacks'),
                },
                {
                    val: 'tooLittleDrink',
                    label: _('Drank too little'),
                },
                {
                    val: 'tooMuchSleep',
                    label: _('Too much sleep'),
                },
                {
                    val: 'notEnoughSleep',
                    label: _('Not enough sleep'),
                },
                {
                    val: 'menstration',
                    label: _('Menstration'),
                }
            ],
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
    };
