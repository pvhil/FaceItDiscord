import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitStats {
    public static String faceitWins;
    public static String faceitRate;
    public static String faceitKD;
    public static String faceitLongest;
    public static JSONArray faceitRecent;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer FACEITTOKEN")
                .uri(URI.create("https://open.faceit.com/data/v4/players/"+faceitAPI.faceitplayerID+"/stats/csgo"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitStats::parse)
                .join();


    }
    public static String parse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        String a = obj.getJSONObject("lifetime").getString("Wins");
        String b = obj.getJSONObject("lifetime").getString("Win Rate %");
        String c = obj.getJSONObject("lifetime").getString("Average K/D Ratio");
        String d = obj.getJSONObject("lifetime").getString("Longest Win Streak");
        JSONArray e = obj.getJSONObject("lifetime").getJSONArray("Recent Results");

        faceitWins = a;
        faceitRate = b;
        faceitKD = c;
        faceitLongest = d;
        faceitRecent = e;


        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
        System.out.println(d);
        System.out.println(e);
        return null;
    }

}

