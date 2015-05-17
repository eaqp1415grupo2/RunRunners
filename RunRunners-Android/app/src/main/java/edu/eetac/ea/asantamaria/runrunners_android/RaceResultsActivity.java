package edu.eetac.ea.asantamaria.runrunners_android;


import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.widget.TextView;

public class RaceResultsActivity extends ActionBarActivity {

    TextView time;
    TextView description_txt;
    TextView speed_txt;
    TextView distance_txt;
    TextView kcal_txt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.raceresults_activity);

        long raceTime = 0;
        float distance= (float) 4.3;
        String description="desde Plaza 1 a calle 3";
        String parameters[];


        time=(TextView)findViewById(R.id.time);
        description_txt=(TextView)findViewById(R.id.description_txt);
        speed_txt=(TextView)findViewById(R.id.speed_txt);
        distance_txt=(TextView)findViewById(R.id.distance_txt);
        kcal_txt=(TextView)findViewById(R.id.kcal_txt);

        Bundle bun = getIntent().getExtras();

        raceTime=bun.getLong("raceTime");

        parameters=getParameters(raceTime,distance);

        time.setText(parameters[0]);

        description_txt.setText(description_txt.getText()+description);
        speed_txt.setText("Velocidad Media: "+parameters[1]+" m/s ("+parameters[3]+" km/h)");
        kcal_txt.setText("kCal quemadas: "+parameters[2]);

        distance_txt.setText("Distancia: "+String.valueOf(distance) + " km");
    }

/*
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }*/


    public String[] getParameters(long time, float distance){

        long t=time/1000;//tiempo en segundos
        int d=(int)distance*1000;//distancia en metros
        String tim="";
        int kcal = 0;

        String[] param = {"N/A","N/A","N/A","N/A"};

        //Obtenemos tiempo en HH:MM:SS
        long timeDifference = time / 1000;
        int h = (int) (timeDifference / (3600));
        int m = (int) ((timeDifference - (h * 3600)) / 60);
        int s = (int) (timeDifference - (h * 3600) - m * 60);

        tim=String.format("%02d:%02d:%02d", h, m, s);
        param[0]=tim;

        //Obtenemos velocidad
        float speed= d/t;// m/s
        float speedkmh= (float) (speed*3.6);

        param[1]= String.valueOf(speed);


        if(speed<1.39){

            kcal=(int)(t*0.04);
        }
        else if(speed>1.39&&speed<1.67){

            kcal=(int)(t*0.08);
        }
        else if(speed>1.67&&speed<2.08){

            kcal=(int)(t*0.1);
        }
        else if(speed>2.08){

            kcal=(int)(t*0.12);
        }

        param[2]= String.valueOf(kcal);
        param[3]= String.valueOf(speedkmh);
        Log.d("",param[3]);

        return param;

    }
}
