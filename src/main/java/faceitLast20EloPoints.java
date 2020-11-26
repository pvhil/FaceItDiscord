import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.DecimalFormat;

public class faceitLast20EloPoints {

    public static String fcEloHistory;
    public static int totalsumkills= 0;
    public static int totalsumdeaths= 0;
    public static double totalsumkd= 0;
    public static String realkd= "0";
    public static int totalsumassists= 0;
    public static int totalsummvps= 0;
    public static int totalsumheadshots= 0;
    public static int totalsumtriple= 0;
    public static int totalsumquadro= 0;
    public static int totalsumace= 0;
    public static int highelo;
    public static int startElo;
    public static int endElo;
    public static int lowelo;
    public static int win = 0;
    public static String kdHistory;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .uri(URI.create("https://api.faceit.com/stats/api/v1/stats/time/users/"+faceitOnlyPlayerId.faceitplayerID+"/games/csgo"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitLast20EloPoints::parse)
                .join();
    }

    public static String parse(String responseBody){
        JSONArray value = new JSONArray(responseBody);
        StringBuilder ep = new StringBuilder();
        StringBuilder kdlist = new StringBuilder();
        DecimalFormat df = new DecimalFormat("#.##");
        int test = DiscordMessage.savedCounter;
        for (int i = 0; i < test; i++) {
            JSONObject elo = value.getJSONObject(i);
            if(elo.has("elo")) {
                String elopoints = elo.getString("elo");
                ep.append(elopoints + ",");

                int e1 = Integer.parseInt(elo.getString("i6"));
                int e2 = Integer.parseInt(elo.getString("i8"));
                double e3 = Double.parseDouble(elo.getString("c2"));
                int e4 = Integer.parseInt(elo.getString("i14"));
                int e5 = Integer.parseInt(elo.getString("i15"));
                int e6 = Integer.parseInt(elo.getString("i7"));
                int e7 = Integer.parseInt(elo.getString("i16"));
                int e8 = Integer.parseInt(elo.getString("i13"));
                int e9 = Integer.parseInt(elo.getString("i9"));

                if(elo.getString("i10").equalsIgnoreCase("1")){
                    win++;
                }

                int runsumkills = e1;
                totalsumkills = runsumkills + totalsumkills;

                int runsumdeaths = e2;
                totalsumdeaths = runsumdeaths + totalsumdeaths;

                double runsumkd = e3;
                kdlist.append(runsumkd + ",");
                totalsumkd = runsumkd + totalsumkd;

                int runsumassists = e6;
                totalsumassists = runsumassists + totalsumassists;

                int runsummvps = e9;
                totalsummvps = runsummvps + totalsummvps;

                int runsumheadshots = e8;
                totalsumheadshots = runsumheadshots + totalsumheadshots;

                int runsumtriple = e4;
                totalsumtriple = runsumtriple + totalsumtriple;

                int runsumquadro = e5;
                totalsumquadro = runsumquadro + totalsumquadro;

                int runsumace = e7;
                totalsumace = runsumace + totalsumace;
            }else {
                System.out.println("testinggggg");
                test++;
            }


        }
        realkd = df.format(totalsumkd/DiscordMessage.savedCounter);
        System.out.println(totalsumkills/15+" "+totalsumdeaths/15+" "+realkd+" " +totalsumassists/15 +" "+totalsummvps/15+" "+totalsumheadshots/15+" "+totalsumtriple+" "+totalsumquadro+" "+totalsumace+" ");
        fcEloHistory = ep.toString();
        kdHistory = kdlist.toString();

        String[] array = fcEloHistory.split(",");
        int largestInt = Integer.MIN_VALUE;
        int lowestInt = Integer.MAX_VALUE;
        for (String numberAsString : array) {
            int number = Integer.parseInt(numberAsString);
            if (number > largestInt) {
                largestInt = number;
                highelo = largestInt;
            }
            if (number < lowestInt) {
                lowestInt = number;
                lowelo = lowestInt;
            }
        }
        endElo = Integer.parseInt(array[0]);
        startElo = Integer.parseInt(array[DiscordMessage.savedCounter-1]);
        System.out.println(largestInt);

        return null;
    }


}
