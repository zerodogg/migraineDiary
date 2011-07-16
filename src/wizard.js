/*
 * Base class for wizards, handles the basic next/prev and callback logic.
 * This class must be extended by an UI class in order to work.
 *
 * Dependencies: jQsimple-class, a pub/sub implementation available on $
 *
 * Publishes the following events:
 * /wizard/done        - parameters: { wizard: this }
 * /wizard/displayStep - parameters: { wizard: this, step: data}  // *after* step has rendered
 *
 * the steps hash which defines the wizard is in the following form:
 *  {
 *      // _meta is a special label that does't act as a wizard step, but contains
 *      // metadata about this wizard.
 *      _meta: {
 *          apiversion: 0,      // The wizard API version this is written for
 *          defaultOrder: [],   // The default order of the wizard (contains an array of
 *                              //  LABEL strings). Depending on the app and renderer this
 *                              //  can be overridden
 *      },
 *
 *      LABEL: {
 *          type: '',              // The type of prompt it is, one of:
 *                                      // selector: radio buttons
 *                                      // time: time input
 *          isSkippable: true,     // Is this step skippable? Can be omitted, in which
 *                                 // case it defaults to true
 *          title: '',             // The title of this step
 *          information: '',       // The "informative text" for this step
 *          changeInformation: '', // The "informative text" for this step, as used when modifying an existing value
 *          prompt: '',            // The "prompt" text for this step, used fo "time" types only.
 *          setting: '',           // The setting to save this data to. Can be omitted, in which case
 *                                 // it defaults to the LABEL
 *          selections: [          // (only when type=selector)
 *              { 
 *                  val: 'VALUE',   // The value of this selection
 *                  label: 'LABEL', // The label of this selection
 *              },
 *          ],
 *      },
 *  }
 */
var wizard = jClass({

    /* Step hash as supplied by the user */
    steps: {},
    /* Extracted from steps upon construction */
    wizardMeta: {},

    /* The stack, contains labels processed so far, used for "back"
     * functionality */
    stack: [],

    /* The list of steps still to be run */
    remainingSteps: [],
    /* The step currently being run */
    currentStep: '',

    ignoredSteps: [],

    /* Data saved by our current session */
    data: {},

    _constructor: function(params)
    {
        this.steps       = params.steps;
        this.wizardMeta  = params.steps._meta;
        this.steps._meta = null;

        if(params.order)
        {
            this.remainingSteps = params.order;
        }
        else
        {
            this.remainingSteps = this.wizardMeta.defaultOrder;
        }

        if(this.wizardMeta.apiversion !== 0)
        {
            throw('Wizard: Unsupported API version: '+this.wizardMeta.apiversion);
        }
        if(this.remainingSteps.length <= 0)
        {
            throw('Wizard: No steps to run (remainingSteps is empty, no params.order or defaultOrder)');
        }
    },

    next: function()
    {
        this._runNextStep(false);
    },

    skip: function()
    {
        this._runNextStep(true);
    },

    _runNextStep: function(skip)
    {
        if(this.currentStep)
        {
            this.stack.push(this.currentStep);
            var onDone = this.getCurrentStep().onDone;
            if (!skip)
            {
                var value      = this.getFieldValue();
                var key        = this.getCurrentStep().setting;
                this.data[key] = value;
                if(onDone)
                {
                    onDone(this,value);
                }
            }
            else if(onDone)
            {
                onDone(this,undefined);
            }
        }
        if(this.remainingSteps.length > 0)
        {
            this.runStep(this.remainingSteps.shift());
        }
        else
        {
            $.publish('/wizard/done', { wizard: this });
        }
    },

    previous: function()
    {
        if(this.stack.length == 0)
        {
            throw('Wizard: Attempt to call previous() on a wizard without previous steps');
        }

        this.remainingSteps.unshift(this.currentStep);

        var prev;
        var ignored = true;
        while(ignored)
        {
            prev = this.stack.pop();
            if(this.stepIgnored(prev))
            {
                this.remainingSteps.unshift(prev);
                ignored = true;
            }
            else
            {
                ignored = false;
            }
        }
        this.runStep(prev);
    },

    runStep: function(stepLabel)
    {
        var step         = this.steps[stepLabel];
        this.currentStep = stepLabel;
        if(this.stepIgnored(stepLabel))
        {
            return this.skip();
        }
        if (!step)
        {
            throw('Wizard: Unable to retrieve step: '+stepLabel);
        }
        this.renderField(step);
        $.publish('/wizard/displayStep', { wizard: this, step: step });
    },

    addIgnoredStep: function(step)
    {
        this.ignoredSteps.push(step);
    },

    removeIgnoredStep: function(step)
    {
        var entry = $.inArray(step,this.ignoredSteps);
        if(entry !== -1)
        {
            this.ignoredSteps[entry] = null;
        }
    },
    stepIgnored: function(step)
    {
        var entry = $.inArray(step,this.ignoredSteps);
        return entry === -1 ? false : true;
    },

    renderField: function(field)
    {
        throw('Wizard: Subclass does not implement renderField()');
    },

    getFieldValue: function()
    {
        throw('Wizard: Subclass does not implement getFieldValue()');
    },

    getCurrentStep: function()
    {
        return this.steps[ this.currentStep ];
    },
});
