import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.DecimalFormat;

public class faceitLast20 {

    public static String matched1;

    public static Integer runsumkills = 0;
    public static Integer totalsumkills = 0;
    public static double realkills = 0;

    public static Integer runsumdeaths = 0;
    public static Integer totalsumdeaths = 0;
    public static double realdeaths = 0;

    public static Integer runsumassists = 0;
    public static Integer totalsumassists = 0;
    public static double realassists = 0;

    public static Integer runsumtriple = 0;
    public static Integer totalsumtriple = 0;
    public static double realtriple = 0;

    public static Integer runsumquadro = 0;
    public static Integer totalsumquadro = 0;
    public static double realquadro = 0;

    public static Integer runsumace = 0;
    public static Integer totalsumace = 0;
    public static double realace = 0;

    public static double runsumkd = 0;
    public static double totalsumkd = 0;
    public static String realkd = null;

    public static Integer runsummvps = 0;
    public static Integer totalsummvps = 0;
    public static double realmvps = 0;

    public static Integer runsumhead = 0;
    public static Integer totalsumhead = 0;
    public static double realhead = 0;


    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/"+faceitOnlyPlayerId.faceitplayerID+"/history?game=csgo&offset=0&limit=15"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitLast20::parse)
                .join();
    }

    public static String parse(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray themap = values.getJSONArray("items");
        DecimalFormat df = new DecimalFormat("#.##");

        for (int i = 0; i < themap.length(); i++) {
            JSONObject mId = themap.getJSONObject(i);
            String realId = mId.getString("match_id");
            matched1 = realId;
            faceitLast20MatchStats.main(null);

            runsumkills = faceitLast20MatchStats.kills;
            totalsumkills = runsumkills + totalsumkills;

            runsumdeaths = faceitLast20MatchStats.deaths;
            totalsumdeaths = runsumdeaths + totalsumdeaths;

            runsumassists = faceitLast20MatchStats.assists;
            totalsumassists = runsumassists + totalsumassists;

            runsummvps = faceitLast20MatchStats.mvps;
            totalsummvps = runsummvps + totalsummvps;

            runsumkd = Double.parseDouble(faceitLast20MatchStats.kdratio);
            totalsumkd = runsumkd + totalsumkd;

            runsumtriple = faceitLast20MatchStats.tripleKills;
            totalsumtriple = runsumtriple + totalsumtriple;

            runsumquadro = faceitLast20MatchStats.quadroKills;
            totalsumquadro = runsumquadro + totalsumquadro;

            runsumace = faceitLast20MatchStats.pentaKills;
            totalsumace = runsumace + totalsumace;

            runsumhead = faceitLast20MatchStats.headshots;
            totalsumhead = runsumhead + totalsumhead;

            System.out.println(realId+" "+ totalsumkills);

        }
         realkills= totalsumkills/15;
         realdeaths = totalsumdeaths/15;
         realassists = totalsumassists/15;
         realmvps = totalsummvps/15;
        realkd = df.format(totalsumkd/15);
        realhead = totalsumhead/15;


        totalsumkills = 0;
        totalsumdeaths = 0;
        totalsumassists = 0;;
        totalsummvps = 0;
        totalsumkd = 0;
        totalsumtriple = 0;
        totalsumhead = 0;


        System.out.println(realace+" "+realhead+" "+realquadro+" "+realkills+" "+realkd);
        return null;
    }

}
