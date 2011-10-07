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

function mLog (message)
{
    if(console && console.log)
    {
        console.log.apply(console,arguments);
    }
    else
    {
        window.mLog = $.noop;
    }
}

var migraineDiary =
{
    UI: null,

    version: '0.2',
    dataVersion: 2,
    confKey: 'org.zerodogg.migraineDiary',

    data: {
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
        // Check for unsupported data
        if(this.data.dataVersion > this.dataVersion)
        {
            $('body').empty();
            $('body').html('The migraineDiary detected data of a version that it does not know how to handle (version '+this.dataVersion+'). This data is from a later version of the migraineDiary, and is incompatible with the version you are currently running. You will have to update the migraineDiary in order to keep using it.<br /><br />See <a href="http://random.zerodogg.org/migrainediary/">http://random.zerodogg.org/migrainediary/</a> for information on how to upgrade.<br /><br />migraineDiary will now shut down.');
            return;
        }
        $.subscribe('/wizard/done',function(params)
        {
            self.appendData(params.wizard.data);
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
        UI.init();
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
            if(data.dataVersion == 1)
            {
                /* ***
                 * Upgrade version 1 migraineDiary data to the version 2 format.
                 * ***
                 *
                 * Version 2 adds several new fields (which obviously needs no upgrading
                 * as they werent there in version 1), but also replaces the "start" field
                 * with startTime, endTime and duration. Seeing as we don't have an endTime
                 * in the old dataset, we can't generate the duration. As such, we just
                 * rename start to startTime and leave the other fields blank.
                 */
                try
                {
                    $.each(data.savedData, function(i,v)
                    {
                        v['startTime'] = v['start'];
                        delete v['start'];
                    });
                }
                catch(e) { }

                this.data.dataVersion = this.dataVersion;
            }

            this.data = data;
        }
        else
        {
            this.data.dataVersion = this.dataVersion;
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
