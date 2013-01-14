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
var MOBILE = navigator.userAgent.match(/(Opera (Mi|Mo)|Android|Mobile)/),
    NATIVE_MOBILE = false;

/* Display an error message to the unfortunate users of these browsers.
 * Needs to be executed here to avoid syntax "errors" later on */
if(!MOBILE && $.browser.msie && parseInt($.browser.version) < 8)
{
    $('body').empty();
    $('body').html('You are running an ancient version of MSIE that does not work with the migraine diary.<br />We recommend that you upgrade to <a href="http://www.getfirefox.com/">Firefox</a>');
    $.browser.broken = true;
}
