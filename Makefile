simpleJSi18nPath=../simpleJSi18n

build: buildBundle buildAndroidBundle
	cat src/browser/*.js src/core.js > migraineDiary.js
	cat src/mobile/*.js  src/core.js > migraineDiary.android.js
buildBundle:
	[ -e "libs/jquery.js" ] || make downloadLibs
	cat libs/jquery.json-2.2.min.js libs/jstorage.min.js libs/jquery-hotkeys.js libs/jqsimple-class.min.js > libs/libs-bundle.js
buildAndroidBundle:
	[ -e "libs/jquery.js" ] || make downloadLibs
	echo -n > libs/libs-bundle-android.js
	first=1; for f in libs/jquery.js libs/jquery-ui.js libs/jquery.json-2.2.min.js libs/jstorage.min.js libs/jquery-hotkeys.js libs/jqsimple-class.min.js; do \
		[ "$$first" != "1" ] && echo "" >> libs/libs-bundle-android.js; \
		first=0; \
		echo "/* $$f */" >> libs/libs-bundle-android.js; \
		cat "$$f" >> libs/libs-bundle-android.js; \
	done

downloadLibs:
	wget --no-check-certificate -O libs/LAB.js https://github.com/getify/LABjs/raw/master/LAB.min.js
	wget --no-check-certificate -O libs/jquery.json-2.2.min.js http://jquery-json.googlecode.com/files/jquery.json-2.2.min.js
	wget --no-check-certificate -O libs/jstorage.min.js http://github.com/andris9/jStorage/raw/master/jstorage.min.js
	wget --no-check-certificate -O libs/jquery-hotkeys.js http://js-hotkeys.googlecode.com/files/jquery.hotkeys-0.7.9.min.js
	wget --no-check-certificate -O libs/jquery.js http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js
	[ -e libs/jquery-ui.js ] || wget --no-check-certificate -O libs/jquery-ui.js http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js
fetchPhoneGap: PG_VERSION=0.9.4
fetchPhoneGap:
	mkdir -p android/libs
	#wget http://phonegap.googlecode.com/files/phonegap-$(PG_VERSION).zip
	unzip phonegap-$(PG_VERSION).zip
	mv phonegap-$(PG_VERSION)/Android/phonegap.$(PG_VERSION).jar android/libs
	rm -rf __MACOSX phonegap-$(PG_VERSION) phonegap-$(PG_VERSION).zip
#fetchJQM: JQM_VERSION=1.0a3
#fetchJQM:
#	rm -rf uistyle-jqt
#	mkdir uistyle-jqt
#	rm -rf uistyle-jqt/images
#	wget http://code.jquery.com/mobile/$(JQM_VERSION)/jquery.mobile-$(JQM_VERSION).zip
#	unzip jquery.mobile-$(JQM_VERSION).zip
#	mv jquery.mobile-$(JQM_VERSION)/images jquery.mobile-$(JQM_VERSION)/jquery.mobile-$(JQM_VERSION).min.css uistyle-jqt
#	mv uistyle-jqt/jquery.mobile-$(JQM_VERSION).min.css uistyle-jqt/jquery.mobile.css
#	mv jquery.mobile-$(JQM_VERSION)/jquery.mobile-$(JQM_VERSION).js libs/jquery.mobile.js
#	rm -rf jquery.mobile-$(JQM_VERSION).zip jquery.mobile-$(JQM_VERSION)

updatepo:
	rm -f po/migraineDiary.pot
	$(simpleJSi18nPath)/jsxgettext po/migraineDiary.pot ./src/*.js ./src/*/*.js
	perl -pi -e 's/SOME DESCRIPTIVE TITLE/migraineDiary/g; s/YEAR THE PACKAGE.S COPYRIGHT HOLDER/2010 Eskild Hustvedt/g; s/PACKAGE VERSION/migraineDiary/g; s/PACKAGE/migraineDiary/g; s/CHARSET/UTF-8/g;' po/migraineDiary.pot
	for po in po/*.po; do msgmerge -U "$$po" "po/migraineDiary.pot";done
	$(simpleJSi18nPath)/jsmsgfmt ./i18n.js ./po/*.po
postat:
	@for f in po/*.po; do  echo "$$f:"; msgfmt --stat -o /dev/null "$$f";done
clean:
	rm -rf ./android/assets/www/* ./android/bin/* ./android/gen/*
androidPrep: clean buildAndroidBundle build
	mkdir -p android/assets/www/
	cp -r i18n.js migraineDiary.css libs uistyle ./android/assets/www/
	cp migraineDiary-android.html ./android/assets/www/index.html
	cp migraineDiary.android.js ./android/assets/www/migraineDiary.js
	perl -pi -e 's/migraineDiary.android.js/migraineDiary.js/g' ./android/assets/www/index.html
androidDebug: androidPrep
	(cd android; ant debug install)
androidBuild:
	@if [ "`stat -c%s "libs/jquery-ui.js"`" -gt "60000" ]; then\
		echo "You have not build a stripped down jquery-ui. Refusing to build."; \
		echo "Download one from http://jqueryui.com/download with only:"; \
		echo "Core,Widget,Mouse,Button,Datepicker"; \
		exit 1; \
	fi
	(cd android; ant release)
	mv android/bin/migraineDiary-unsigned.apk .
