/*! - Copyright Eskild Hustvedt 2010
 * Code license: GNU LGPLv3 */
/*
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 The payload data does not fall under the above license.
 */

(function (window)
{
    var map = null,
        lang = null,
        langs = null;

    /* Begin payload data */
    map ={"Light headache (able to function)":{"nb":"Lett hodepine (g&aring; greitt &aring; fungere)","nn":"Lett hodepine (g&aring; greitt &aring; fungere)"},"Severe":{"nb":"Kraftig","nn":"Kraftig"},"Sleep":{"nb":"S&oslash;vn","nn":"S&oslash;vn"},"Select the date for this entry":{"nb":"Velg en dato for denne oppf&oslash;ringen","nn":"Vel ein dato for denne oppf&oslash;ringa"},"Sunday":{"nb":"S&oslash;ndag","nn":"Sundag"},"4 hours or less":{"nb":"4 timer eller mindre","nn":"4 timar eller mindre"},"2.5 litre":{"nb":"2.5 liter","nn":"2.5 liter"},"A fatal error occurred while saving the data. Your data has probably not been saved.":{"nb":"En fatal feil oppstod under lagring. Oppf&oslash;ringene dine er sannsynligvis ikke lagret.","nn":"Ein fatal feil oppstod under lagring. Oppf&oslash;ringane dine er sannsynlegvis ikkje lagra."},"8 hours":{"nb":"8 timer","nn":"8 timar"},"N/A (not female)":{"nb":"N/A (er ikke kvinne)","nn":"N/A (er ikkje kvinne)"},"Date":{"nb":"Dato","nn":"Dato"},"Severe headache (unable to function)":{"nb":"Kraftig hodepine (klarer ikke &aring; fungere)","nn":"Kraftig hodepine (klarar ikkje &aring; fungere)"},"Approx. how much have you had to drink today?":{"nb":"Ca. hvor mye har du drukket i dag?","nn":"Ca. kor mye har du drukket i dag?"},"7 hours":{"nb":"7 timer","nn":"7 timar"},"Are you sure you want to <b>permanently</b> delete this entry?":{"nb":"Er du sikker p&aring; at du vil slette denne oppf&oslash;ringen <b>permanent</b>?","nn":"Er du sikkjer p&aring; at du vil slette denne oppf&oslash;ringen <b>permanent</b>?"},"Yes":{"nb":"Ja","nn":"Ja"},"Wednesday":{"nb":"Onsdag","nn":"Onsdag"},"What effect did the medication have?":{"nb":"Hvilken effekt hadde medisinene?","nn":"Kva effekt hadde medisinene?"},"2 litre":{"nb":"2 liter","nn":"2 liter"},"Good, but regressed":{"nb":"Bra, men hadde tilbakefall","nn":"Bra, men hadde tilbakefall"},"1 litre":{"nb":"1 liter","nn":"1 liter"},"Sa":{"nb":"La","nn":"L&oslash;"},"Did you take any medication?":{"nb":"Tok du noen medisiner?","nn":"Tok du nokon medisiner?"},"No":{"nb":"Nei","nn":"Nei"},"Drink":{"nb":"Drikke","nn":"Drikkje"},"Hours of sleep":{"nb":"Sov (timer)","nn":"Sov (timar)"},"1.5 litre":{"nb":"1.5 liter","nn":"1.5 liter"},"Finish":{"nb":"Ferdig","nn":"Ferdig"},"Moderate headache (able to function, but somewhat difficuilt)":{"nb":"Moderat hodepine (fungerer, men det er vanskeleg)","nn":"Moderat hodepine (fungerer, men det er vanskeleg)"},"Friday":{"nb":"Fredag","nn":"Fredag"},"Medication (effect)":{"nb":"Medisiner (effekt)","nn":"Medisiner (effekt)"},"When did the migraine start?":{"nb":"N&aring;r startet migrenen?","nn":"N&aring;r startet migrenen?"},"You must select a value":{"nb":"Du m&aring; velge noe","nn":"Du m&aring; velje noko"},"Tu":{"nb":"Ti","nn":"Ty"},"6 hours":{"nb":"6 timer","nn":"6 timar"},"3 litre or more":{"nb":"3 liter eller mer","nn":"3 liter eller mer"},"Took medication?":{"nb":"Tok medisiner?","nn":"Tok medisiner?"},"12 hours or more":{"nb":"12 timer eller mer","nn":"12 timar eller mer"},"Save change":{"nb":"Lagre endringen","nn":"Lagre endringa"},"Migraine intensity":{"nb":"Migreneintensitet","nn":"Migreneintensitet"},"Add entry":{"nb":"Legg til oppf&oslash;ring","nn":"Legg til oppf&oslash;ring"},"View entries":{"nb":"Vis oppf&oslash;ringer","nn":"Vis oppf&oslash;ringar"},"How intense was the migraine?":{"nb":"Hvor intens var migrenen?","nn":"Kor intens var migrenen?"},"Su":{"nb":"S&oslash;","nn":"S&oslash;"},"Med. effect":{"nb":"Med. effekt","nn":"Med. effekt"},"Approx. how much have you had to drink?":{"nb":"Ca. hvor mye drakk du?","nn":"Ca. kor mye drakk du?"},"Th":{"nb":"To","nn":"To"},"None":{"nb":"Ingen","nn":"Ingen"},"Less than 1 litre":{"nb":"Mindre enn 1 liter","nn":"Mindre enn 1 liter"},"Very good":{"nb":"Veldig bra","nn":"Veldig bra"},"Menstral period":{"nb":"Mensen","nn":"Mensen"},"All data saved by the Migraine Diary is saved locally in your browser. No data is sent to the server. This storage is permanent accross browser sessions, but if you explicitly delete \"local storage\" data from your browser, it will be permanently lost.":{"nb":"All data lagra av migrenedakboka er lagra lokalt i nettleseren din, og blir aldri sent til tjeneren. Lagringa er permanent, og blir ikke sletta n&aring;r du avslutter nettleseren, men viss du velger &aring; slette &laquo;lokal lagring&raquo; i nettleseren vil det bli slettet permanent.","nn":"All data lagra av migrenedakboka er lagra lokalt i nettlesaren din, og blir aldri sent til tenaren. Lagringa er permanent, og blir ikkje sletta n&aring;r du avsluttar nettlesaren, men viss du vel &aring; slette &laquo;lokal lagring&raquo; i nettlesaren vil det bli sletta permanent."},"Done, data saved (locally in your browser).":{"nb":"Ferdig, data lagret (lokalt i nettleseren din).","nn":"Ferdig, data lagret (lokalt i din nettlesar)."},"Ok":{"nb":"Ok","nn":"Ok"},"Did you have your menstral period?":{"nb":"Hadde du mensen?","nn":"Hadde du mensen?"},"We":{"nb":"On","nn":"On"},"Tuesday":{"nb":"Tirsdag","nn":"Tysdag"},"Mo":{"nb":"Ma","nn":"M&aring;"},"Moderate":{"nb":"Moderat","nn":"Moderat"},"Started at":{"nb":"Startet","nn":"Startet"},"Started":{"nb":"Startet","nn":"Startet"},"Fr":{"nb":"Fr","nn":"Fr"},"Approx. how long did you sleep?":{"nb":"Ca. hvor lenge sov du?","nn":"Ca. kor lenge s&oslash;v du?"},"Continue":{"nb":"Fortsett","nn":"Fortsett"},"9 hours":{"nb":"9 timer","nn":"9 timar"},"5 hours":{"nb":"5 timer","nn":"5 timar"},"Thursday":{"nb":"Torsdag","nn":"Torsdag"},"11 hours":{"nb":"11 timer","nn":"11 timar"},"Learn more about storage":{"nb":"L&aelig;r mer om lagring","nn":"L&aeligh;r meir om lagring"},"Light":{"nb":"Lett","nn":"Lett"},"Migraine Diary":{"nb":"Migrenedagbok","nn":"Migrenedagbok"},"Monday":{"nb":"Mandag","nn":"M&aring;ndag"},"Saturday":{"nb":"L&oslash;rdag","nn":"Laurdag"},"10 hours":{"nb":"10 timer","nn":"10 timar"},"Approx. how long did you sleep last night?":{"nb":"Ca. hvor lenge sov du i natt?","nn":"Ca. kor lenge s&oslash;v du i n&aring;tt?"},"Medication":{"nb":"Medisiner","nn":"Medisiner"},"Some":{"nb":"Noen","nn":"Nokon"},"Intensity":{"nb":"Intensitet","nn":"Intensitet"}},langs = {"nb":1,"nn":1};

    /* End of payload data */

    /* Main gettext method */
    var gettext = function (string)
    {
        var str = map[string][lang];
        if(str && str.length)
            return str;
        return string;
    };

    /* Initialization method. We don't initialize until the first call to _/gettext.
     * After initialization has finished, we will replace _/gettext with the proper
     * gettext method over */
    window._ = window.gettext = function (string)
    {
        var language = navigator.language || navigator.browserLanguage; 
        if(window['_LANGUAGE'])
        {
            language = window['_LANGUAGE'];
        }

        var languages = language.split(/(;|,)/);
        for (var i = 0; i < languages.length; i++)
        {
            var tryLang = languages[i];
            if (langs[tryLang])
            {
                lang = tryLang;
                break;
            }
        }
        if(lang)
        {
            // Replace us with the proper gettext
            window.gettext = window._ = gettext;
        }
        else
        {
            // We didn't detect any language that is supported.
            // Replace ourselves with a dummy function.
            window.gettext = window._ = function(s) { return s; };
        }
        return window.gettext(string);
    };
})(window);
