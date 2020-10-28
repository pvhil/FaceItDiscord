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


    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/matches/"+faceitLatest.matchID+"/stats"))
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

        System.out.println(theMap+" "+endScore);
        System.out.println(pentaKills+tripleKills+assists+kills+quadroKills+mvps+deaths+kdratio+headshots);
        return null;
    }
}
