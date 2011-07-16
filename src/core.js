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

var migraineDiary =
{
    UI: null,

    version: '0.2',
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
