package edu.eetac.ea.asantamaria.runrunners_android;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;



import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class ChronometerActivity extends Activity implements OnClickListener {

    //Controls
    android.widget.Chronometer chrono;
    Button btnStart;
    Button btnStop;

    //Variables
    long raceTime = 0;
    String currentTime = "";
    Boolean resume = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.chronometer_activity);
        chrono = (android.widget.Chronometer) findViewById(R.id.chrono);
        btnStart = (Button) findViewById(R.id.btnStart);
        btnStop = (Button) findViewById(R.id.btnStop);

    }

    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnStart:
                btnStart.setEnabled(false);
                btnStop.setEnabled(true);
                if (!resume) {
                    chrono.setBase(SystemClock.elapsedRealtime());
                    chrono.start();
                } else {

                    chrono.start();
                }
                btnStart.setBackgroundColor(0);
                btnStart.setTextColor(0);

                break;
            case R.id.btnStop:
                btnStart.setEnabled(true);
                btnStop.setEnabled(false);
                chrono.stop();
                chrono.setText(currentTime);
                raceTime = (SystemClock.elapsedRealtime() - chrono.getBase());


                Intent in=new Intent(ChronometerActivity.this,RaceResultsActivity.class);
                in.putExtra("raceTime",raceTime);
                startActivity(in);
                break;
        }
    }


    public static String timeDifference(long timeDifference1) {
        long timeDifference = timeDifference1 / 1000;
        int h = (int) (timeDifference / (3600));
        int m = (int) ((timeDifference - (h * 3600)) / 60);
        int s = (int) (timeDifference - (h * 3600) - m * 60);

        return String.format("%02d:%02d:%02d", h, m, s);


    }

}
