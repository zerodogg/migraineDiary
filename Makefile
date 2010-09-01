simpleJSi18nPath=../simpleJSi18n

downloadLibs:
	wget -O libs/jquery.json-2.2.min.js http://jquery-json.googlecode.com/files/jquery.json-2.2.min.js
	wget -O libs/jstorage.min.js http://github.com/andris9/jStorage/raw/master/jstorage.min.js

updatepo:
	rm -f po/migraineDiary.pot
	$(simpleJSi18nPath)/jsxgettext po/migraineDiary.pot ./migraineDiary.js
	perl -pi -e 's/SOME DESCRIPTIVE TITLE/migraineDiary/g; s/YEAR THE PACKAGE.S COPYRIGHT HOLDER/2010 Eskild Hustvedt/g; s/PACKAGE VERSION/migraineDiary/g; s/PACKAGE/migraineDiary/g; s/CHARSET/UTF-8/g;' po/migraineDiary.pot
