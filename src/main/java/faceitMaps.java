import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitMaps {
    public static String matches;
    public static String playedRounds;
    public static String headshots;
    public static String avgDeaths;
    public static String avgKills;
    public static String allkills;
    public static String alldeaths;
    public static String wins;
    public static String pentakills;
    public static String quadrokills;
    public static String triplekills;
    public static String alltimekd;
    public static String avgkd;
    public static String assists;
    public static String mvps;
    public static String winrate;
    public static String headshotspermatch;
    public static String mappicture;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/"+faceitOnlyPlayerId.faceitplayerID+"/stats/csgo"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitMaps::parse)
                .join();

    }
    private static boolean mapexists(JSONObject jsonArray, String usernameToFind) {
        return jsonArray.toString().contains("\"label\":\""+usernameToFind+"\"");
    }

    public static String parse(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray themap = values.getJSONArray("segments");
        for (int i = 0; i < themap.length(); i++) {
            JSONObject jOBJ = themap.getJSONObject(i);
            if(mapexists(jOBJ, DiscordMessage.mapCode)) {
                mappicture = jOBJ.getString("img_regular");
                JSONObject jArray = jOBJ.getJSONObject("stats");
                matches = jArray.getString("Matches");
                playedRounds = jArray.getString("Rounds");
                headshots = jArray.getString("Headshots");
                avgDeaths = jArray.getString("Average Deaths");
                avgKills = jArray.getString("Average Kills");
                alldeaths = jArray.getString("Deaths");
                alltimekd = jArray.getString("K/D Ratio");
                wins = jArray.getString("Wins");
                triplekills = jArray.getString("Triple Kills");
                quadrokills = jArray.getString("Quadro Kills");
                pentakills = jArray.getString("Penta Kills");
                winrate = jArray.getString("Win Rate %");
                allkills = jArray.getString("Kills");
                mvps = jArray.getString("MVPs");
                assists = jArray.getString("Assists");
                headshotspermatch = jArray.getString("Headshots per Match");
                avgkd = jArray.getString("Average K/D Ratio");

                System.out.println(avgkd+headshotspermatch+winrate);
            }
        }return null;
    }
}

