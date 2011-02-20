
    package org.zerodogg.migraineDiary;

    import android.app.Activity;
    import android.os.Bundle;
    import com.phonegap.*;

    public class migraineDiary extends DroidGap
    {
        @Override
        public void onCreate(Bundle savedInstanceState)
        {
            super.onCreate(savedInstanceState);
            super.loadUrl("file:///android_asset/www/index.html");
        }
    }
    
