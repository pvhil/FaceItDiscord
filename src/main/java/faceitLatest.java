import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitLatest {
    public static String team1;
    public static String team2;
    public static String players1;
    public static String players2;
    public static String latestGameURL;
    public static String gameWinner;
    public static String matchID;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " +main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/"+faceitOnlyPlayerId.faceitplayerID+"/history?game=csgo&offset=0&limit=1"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitLatest::parse)
                .join();
    }
    //needs rewrite in future
    public static String parse(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray themap = values.getJSONArray("items");
        JSONObject map = themap.getJSONObject(0);
        JSONObject xx = map.getJSONObject("teams");
        String link = map.getString("faceit_url");
        JSONObject frac1 = xx.getJSONObject("faction1");
        JSONObject frac2 = xx.getJSONObject("faction2");
        String t2 = frac2.getString("nickname");
        String t1  = frac1.getString("nickname");
        JSONArray pplayers1 = frac1.getJSONArray("players");
        JSONArray pplayers2 = frac2.getJSONArray("players");
        JSONObject wWin = map.getJSONObject("results");
        String wwinner = wWin.getString("winner");
        matchID = map.getString("match_id");

        StringBuilder sb1 = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            JSONObject a = pplayers1.getJSONObject(i);
            String player1 = a.getString("nickname");
            sb1.append(player1 +" "+"\n"+" ");


        }
        String pp1 = sb1.toString();
        StringBuilder sb2 = new StringBuilder();
        for (int i = 0; i < 5; i++){
            JSONObject a = pplayers2.getJSONObject(i);
            String player2 = a.getString("nickname");
            sb2.append(player2+" "+"\n"+" ");
        }
        String pp2 = sb2.toString();
            team1 = t1;
            team2 = t2;
            players2 = pp2;
            players1 = pp1;
            gameWinner = wwinner;
            latestGameURL = link.replaceAll("lang", "en")
                    .replace("{", "")
                    .replace("}", "");
        System.out.println(t1+ " "+ pp1+" "+t2+" "+pp2 +"  "+latestGameURL+" "+ gameWinner);
        faceitdetailedMatch.main(null);
            return null;

        }
}
