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
 */

(function ()
{
	var map = null;

	window.gettext = window._ = function (string)
	{
		if(map == null)
		{
			initI18N();
		}
		if(map[string] != null && map[string].length > 0)
			return map[string];
		return string;
	}

	function initI18N ()
	{
		map = {};
		var language = navigator.language || navigator.browserLanguage; 
		try
		{
			if(_I18N_LANGUAGE_OVERRIDE !== undefined)
			{
				language = _I18N_LANGUAGE_OVERRIDE;
			}
		} catch(e) { }

		var languages = language.split(/(;|,)/);
		for (var i = 0; i < languages.length; i++)
		{
			var lang = languages[i];
			if(I18N_CONTENT[lang])
			{
				map = I18N_CONTENT[lang];
				break;
			}
		}
	}
})();
/* PAYLOAD DATA */
var I18N_CONTENT={};I18N_CONTENT["nb"]={"Light headache (able to function)":"Lett hodepine (g&aring; greitt &aring; fungere)","Severe":"Kraftig","Sleep":"S&oslash;vn","Select the date for this entry":"Velg en dato for denne oppf&oslash;ringen","Sunday":"S&oslash;ndag","4 hours or less":"4 timer eller mindre","2.5 litre":"2.5 liter","A fatal error occurred while saving the data. Your data has probably not been saved.":"En fatal feil oppstod under lagring. Oppf&oslash;ringene dine er sannsynligvis ikke lagret.","8 hours":"8 timer","N/A (not female)":"N/A (er ikke kvinne)","Date":"Dato","Severe headache (unable to function)":"Kraftig hodepine (klarer ikke &aring; fungere)","Approx. how much have you had to drink today?":"Ca. hvor mye har du drukket i dag?","7 hours":"7 timer","Are you sure you want to <b>permanently</b> delete this entry?":"Er du sikker p&aring; at du vil slette denne oppf&oslash;ringen <b>permanent</b>?","Yes":"Ja","What effect did the medication have?":"Hvilken effekt hadde medisinene?","Wednesday":"Onsdag","2 litre":"2 liter","Good, but regressed":"Bra, men hadde tilbakefall","1 litre":"1 liter","Sa":"La","Did you take any medication?":"Tok du noen medisiner?","No":"Nei","Drink":"Drikke","Hours of sleep":"Sov (timer)","1.5 litre":"1.5 liter","Finish":"Ferdig","Moderate headache (able to function, but somewhat difficuilt)":"Moderat hodepine (fungerer, men det er vanskeleg)","Friday":"Fredag","Medication (effect)":"Medisiner (effekt)","When did the migraine start?":"N&aring;r startet migrenen?","Tu":"Ti","6 hours":"6 timer","3 litre or more":"3 liter eller mer","Took medication?":"Tok medisiner?","12 hours or more":"12 timer eller mer","Save change":"Lagre endringen","Migraine intensity":"Migreneintensitet","Add entry":"Legg til oppf&oslash;ring","View entries":"Vis oppf&oslash;ringer","How intense was the migraine?":"Hvor intens var migrenen?","Su":"S&oslash;","Med. effect":"Med. effekt","Approx. how much have you had to drink?":"Ca. hvor mye drakk du?","Th":"To","None":"Ingen","Less than 1 litre":"Mindre enn 1 liter","Very good":"Veldig bra","Menstral period":"Mensen","All data saved by the Migraine Diary is saved locally in your browser. No data is sent to the server. This storage is permanent accross browser sessions, but if you explicitly delete \"local storage\" data from your browser, it will be permanently lost.":"All data lagra av migrenedakboka er lagra lokalt i nettleseren din, og blir aldri sent til tjeneren. Lagringa er permanent, og blir ikke sletta n&aring;r du avslutter nettleseren, men viss du velger &aring; slette &laquo;lokal lagring&raquo; i nettleseren vil det bli slettet permanent.","Done, data saved (locally in your browser).":"Ferdig, data lagret (lokalt i nettleseren din).","Ok":"Ok","Did you have your menstral period?":"Hadde du mensen?","We":"On","Tuesday":"Tirsdag","Mo":"Ma","Moderate":"Moderat","Started at":"Startet","Started":"Startet","Fr":"Fr","Approx. how long did you sleep?":"Ca. hvor lenge sov du?","Continue":"Fortsett","Thursday":"Torsdag","5 hours":"5 timer","9 hours":"9 timer","11 hours":"11 timer","Learn more about storage":"L&aelig;r mer om lagring","Migraine Diary":"Migrenedagbok","Light":"Lett","Monday":"Mandag","Saturday":"L&oslash;rdag","Approx. how long did you sleep last night?":"Ca. hvor lenge sov du i natt?","10 hours":"10 timer","Medication":"Medisiner","Some":"Noen","Intensity":"Intensitet"};I18N_CONTENT["nn"]={"Light headache (able to function)":"Lett hodepine (g&aring; greitt &aring; fungere)","Severe":"Kraftig","Sleep":"S&oslash;vn","Select the date for this entry":"Vel ein dato for denne oppf&oslash;ringa","Sunday":"Sundag","4 hours or less":"4 timar eller mindre","2.5 litre":"2.5 liter","A fatal error occurred while saving the data. Your data has probably not been saved.":"Ein fatal feil oppstod under lagring. Oppf&oslash;ringane dine er sannsynlegvis ikkje lagra.","8 hours":"8 timar","N/A (not female)":"N/A (er ikkje kvinne)","Date":"Dato","Severe headache (unable to function)":"Kraftig hodepine (klarar ikkje &aring; fungere)","Approx. how much have you had to drink today?":"Ca. kor mye har du drukket i dag?","7 hours":"7 timar","Are you sure you want to <b>permanently</b> delete this entry?":"Er du sikkjer p&aring; at du vil slette denne oppf&oslash;ringen <b>permanent</b>?","Yes":"Ja","What effect did the medication have?":"Kva effekt hadde medisinene?","Wednesday":"Onsdag","2 litre":"2 liter","Good, but regressed":"Bra, men hadde tilbakefall","1 litre":"1 liter","Sa":"L&oslash;","Did you take any medication?":"Tok du nokon medisiner?","No":"Nei","Drink":"Drikkje","Hours of sleep":"Sov (timar)","1.5 litre":"1.5 liter","Finish":"Ferdig","Moderate headache (able to function, but somewhat difficuilt)":"Moderat hodepine (fungerer, men det er vanskeleg)","Friday":"Fredag","Medication (effect)":"Medisiner (effekt)","When did the migraine start?":"N&aring;r startet migrenen?","Tu":"Ty","6 hours":"6 timar","3 litre or more":"3 liter eller mer","Took medication?":"Tok medisiner?","12 hours or more":"12 timar eller mer","Save change":"Lagre endringa","Migraine intensity":"Migreneintensitet","Add entry":"Legg til oppf&oslash;ring","View entries":"Vis oppf&oslash;ringar","How intense was the migraine?":"Kor intens var migrenen?","Su":"S&oslash;","Med. effect":"Med. effekt","Approx. how much have you had to drink?":"Ca. kor mye drakk du?","Th":"To","None":"Ingen","Less than 1 litre":"Mindre enn 1 liter","Very good":"Veldig bra","Menstral period":"Mensen","All data saved by the Migraine Diary is saved locally in your browser. No data is sent to the server. This storage is permanent accross browser sessions, but if you explicitly delete \"local storage\" data from your browser, it will be permanently lost.":"All data lagra av migrenedakboka er lagra lokalt i nettlesaren din, og blir aldri sent til tenaren. Lagringa er permanent, og blir ikkje sletta n&aring;r du avsluttar nettlesaren, men viss du vel &aring; slette &laquo;lokal lagring&raquo; i nettlesaren vil det bli sletta permanent.","Done, data saved (locally in your browser).":"Ferdig, data lagret (lokalt i din nettlesar).","Ok":"Ok","Did you have your menstral period?":"Hadde du mensen?","We":"On","Tuesday":"Tysdag","Mo":"M&aring;","Moderate":"Moderat","Started at":"Startet","Started":"Startet","Fr":"Fr","Approx. how long did you sleep?":"Ca. kor lenge s&oslash;v du?","Continue":"Fortsett","Thursday":"Torsdag","5 hours":"5 timar","9 hours":"9 timar","11 hours":"11 timar","Learn more about storage":"L&aeligh;r meir om lagring","Migraine Diary":"Migrenedagbok","Light":"Lett","Monday":"M&aring;ndag","Saturday":"Laurdag","Approx. how long did you sleep last night?":"Ca. kor lenge s&oslash;v du i n&aring;tt?","10 hours":"10 timar","Medication":"Medisiner","Some":"Nokon","Intensity":"Intensitet"};