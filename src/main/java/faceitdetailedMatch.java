import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitdetailedMatch {
    public static String theMap;
    public static String endScore;
    public static JSONObject testJSONObject;
    public static String pentaKills;
    public static String tripleKills;
    public static String assists;
    public static String kills;
    public static String headshots;
    public static String kdratio;
    public static String quadroKills;
    public static String mvps;
    public static String deaths;
    public static String KR;
    public static String headperc;
    public static double rating = 0;


    public static void main(String[] args) {
        rating = 0;
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/matches/" + faceitLatest.matchID + "/stats"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitdetailedMatch::parse)
                .join();
    }

    private static boolean userexists(JSONObject jsonArray, String usernameToFind) {
        return jsonArray.toString().contains("\"player_id\":\""+usernameToFind+"\"");
    }

    public static String parse(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray rounds = values.getJSONArray("rounds");
        JSONObject map = rounds.getJSONObject(0);
        theMap = map.getJSONObject("round_stats").getString("Map");
        endScore = map.getJSONObject("round_stats").getString("Score");
        String roundsPlayed = map.getJSONObject("round_stats").getString("Rounds");

        for (int i = 0; i < rounds.length(); i++){
            JSONObject jOBJ = rounds.getJSONObject(i);
            JSONArray jArray = jOBJ.getJSONArray("teams");
            for (int j = 0; j < jArray.length(); j++)
            {
                JSONObject jOBJNEW = jArray.getJSONObject(j);
                JSONArray jPlayers = jOBJNEW.getJSONArray("players");
                for (int kd = 0; kd < jPlayers.length(); kd++){
                    JSONObject jTest = jPlayers.getJSONObject(kd);
                    if(userexists(jTest, faceitOnlyPlayerId.faceitplayerID)) {
                        System.out.println(jTest);
                        testJSONObject = jTest;
                    }
                }
            }
        }
        JSONObject playerStats = testJSONObject.getJSONObject("player_stats");
        pentaKills = playerStats.getString("Penta Kills");
        tripleKills = playerStats.getString("Triple Kills");
        assists = playerStats.getString("Assists");
        kills = playerStats.getString("Kills");
        quadroKills = playerStats.getString("Quadro Kills");
        mvps = playerStats.getString("MVPs");
        deaths = playerStats.getString("Deaths");
        kdratio = playerStats.getString("K/D Ratio");
        headshots = playerStats.getString("Headshot");
        KR = playerStats.getString("K/R Ratio");
        headperc = playerStats.getString("Headshots %");


        System.out.println(theMap + " " + endScore);
        System.out.println(pentaKills + tripleKills + assists + kills + quadroKills + mvps + deaths + kdratio + headshots);

        double killRating = 0;
        double survivalRating = 0;
        double roundsWithMultipleKillsRating = 0;
        double AVERAGE_KPR = 0.679;
        double AVERAGE_SPR = 0.317;
        double AVERAGE_RMK = 1.277;

        killRating = Double.parseDouble(kills) / Double.parseDouble(roundsPlayed) / AVERAGE_KPR;
        survivalRating = (Double.parseDouble(roundsPlayed) - Double.parseDouble(deaths)) / Double.parseDouble(roundsPlayed) / AVERAGE_SPR;
        roundsWithMultipleKillsRating = (25 * Double.parseDouble(pentaKills) + 16 * Double.parseDouble(quadroKills) + 9 * Double.parseDouble(tripleKills) + 2 * (Double.parseDouble(kills) - (5 * Double.parseDouble(pentaKills) + 4 * Double.parseDouble(quadroKills) + 3 * Double.parseDouble(tripleKills)))) / Double.parseDouble(roundsPlayed) / AVERAGE_RMK;
        rating = (killRating + 0.7 * survivalRating + roundsWithMultipleKillsRating) / 2.7;
        System.out.println(killRating + " " + survivalRating + " " + roundsWithMultipleKillsRating + " " + rating);
        rating = Math.round(rating * 100) / 100.0;


        return null;
    }
}
