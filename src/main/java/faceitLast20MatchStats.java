import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitLast20MatchStats {

    public static String test123;
    public static JSONObject testJSONObject;

    public static Integer theMap;
    public static Integer endScore;
    public static Integer pentaKills;
    public static Integer tripleKills;
    public static Integer assists;
    public static Integer kills;
    public static Integer headshots;
    public static String kdratio;
    public static Integer quadroKills;
    public static Integer mvps;
    public static Integer deaths;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer a0397b8a-776b-4a20-b606-7733526753b3")
                .uri(URI.create("https://open.faceit.com/data/v4/matches/"+faceitLast20.matched1+"/stats"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitLast20MatchStats::parseMatch)
                .join();
    }
    private static boolean userexists(JSONObject jsonArray, String usernameToFind) {
        return jsonArray.toString().contains("\"player_id\":\"" + usernameToFind + "\"");
    }

    public static String parseMatch(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray rounds = values.getJSONArray("rounds");
        JSONObject map = rounds.getJSONObject(0);

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
                        testJSONObject = jTest;

                    }
                }
            }
        }
        JSONObject playerStats = testJSONObject.getJSONObject("player_stats");
        pentaKills = playerStats.getInt("Penta Kills");
        tripleKills = playerStats.getInt("Triple Kills");
        assists = playerStats.getInt("Assists");
        kills = playerStats.getInt("Kills");
        quadroKills = playerStats.getInt("Quadro Kills");
        mvps = playerStats.getInt("MVPs");
        deaths = playerStats.getInt("Deaths");
        kdratio = playerStats.getString("K/D Ratio");
        headshots = playerStats.getInt("Headshot");
        System.out.println(kills);
        return null;
    }

}
