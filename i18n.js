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

	function gettext (string)
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

	window._       = gettext;
	window.gettext = gettext;
})();
/* PAYLOAD DATA */
var I18N_CONTENT={};I18N_CONTENT["nb"]={"12 hours or more":"12 timer eller mer","Light headache (able to function)":"Lett hodepine (g&aring; greit &aring; fungere)","Migraine intensity":"Migreneintensitet","Sleep":"S&oslash;vn","How intense was the migraine?":"Hvor intens var migrenen?","Done, data saved (locally).":"Ferdig, data lagret (lokalt).","4 hours or less":"4 timer eller mindre","None":"Ingen","2.5 litre":"2.5 liter","Less than 1 litre":"Mindre enn 1 liter","8 hours":"8 timer","Very good":"Veldig bra","N/A (not female)":"N/A (er ikke kvinne)","Menstral period":"Mensen","Severe headache (unable to function)":"Kraftig hodepine (klarar ikke &aring; fungere)","Did you have your menstral period?":"Hadde du mensen?","Approx. how much have you had to drink today?":"Ca. hvor mye har du drukket i dag?","7 hours":"7 timer","Yes":"Ja","What effect did the medication have?":"Hvilken effekt hadde medisinene?","2 litre":"2 liter","Good, but regressed":"Bra, men hadde tilbakefall","1 litre":"1 liter","Did you take any medication?":"Tok du noen medisiner?","Started":"Startet","No":"Nei","Drink":"Drikke","Continue":"Fortsett","1.5 litre":"1.5 liter","Finish":"Ferdig","5 hours":"5 timer","9 hours":"9 timer","11 hours":"11 timer","Moderate headache (able to function, but somewhat difficuilt)":"Moderat hodepine (fungerer, men det er vanskelig)","Medication (effect)":"Medisiner (effekt)","When did the migraine start?":"N&aring;r starta migrenen?","Approx. how long did you sleep last night?":"Ca. hvor lenge sov du i natt?","10 hours":"10 timer","Medication":"Medisiner","6 hours":"6 timer","Some":"Noe","3 litre or more":"3 liter eller mer"};I18N_CONTENT["nn"]={"12 hours or more":"12 timer eller meir","Light headache (able to function)":"Lett hodepine (g&aring; greitt &aring; fungere)","Migraine intensity":"Migreneintensitet","Sleep":"S&oslash;vn","How intense was the migraine?":"Kor intens var migrenen?","Done, data saved (locally).":"Ferdig, data lagra (lokalt).","4 hours or less":"4 timer eller mindre","None":"Ingen","2.5 litre":"2.5 liter","Less than 1 litre":"Mindre enn 1 liter","8 hours":"8 timer","Very good":"Veldig bra","N/A (not female)":"N/A (er ikkje kvinne)","Menstral period":"Mensen","Severe headache (unable to function)":"Kraftig hodepine (klarar ikkje &aring; fungere)","Did you have your menstral period?":"Hadde du mensen?","Approx. how much have you had to drink today?":"Ca. kor mykje har du drukket i dag?","7 hours":"7 timer","Yes":"Ja","What effect did the medication have?":"Kva effekt hadde medisinene?","2 litre":"2 liter","Good, but regressed":"Bra, men hadde tilbakefall","1 litre":"1 liter","Did you take any medication?":"Tok du nokon medisiner?","Started":"Startet","No":"Nei","Drink":"Drikke","Continue":"Fortsett","1.5 litre":"1.5 liter","Finish":"Ferdig","5 hours":"5 timer","9 hours":"9 timer","11 hours":"11 timer","Moderate headache (able to function, but somewhat difficuilt)":"Moderat hodepine (fungerer, men det er vanskeleg)","Medication (effect)":"Medisiner (effekt)","When did the migraine start?":"N&aring;r starta migrenen?","Approx. how long did you sleep last night?":"Ca. kor lenge sov du i n&aring;tt?","10 hours":"10 timer","Medication":"Medisiner","6 hours":"6 timer","Some":"Nokon","3 litre or more":"3 liter eller meir"};