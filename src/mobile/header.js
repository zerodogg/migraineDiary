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
// Simplistic 'mobile browser' detection
var MOBILE = true,
    NATIVE_MOBILE = true;

/*
 * Additional language detection for when browser language does
 * not match Android/mobile locale.
 */
try
{
    if (navigator.language == 'en')
    {
        var language = navigator.userAgent.split('; ')[3].replace(/-.+/,'');
        window._LANGUAGE = language;
    }
} catch(e){ };
