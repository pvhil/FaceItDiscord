import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitAPI {
    public static String faceitplayerID;
    public static String premium;
    public static String faceitAvatar;
    public static String faceitplayerCountry;
    public static Integer faceitLevel;
    public static Integer faceitElo;
    public static Integer faceitAfk;
    public static Integer faceitLeave;
    public static String profileURL;
    public static String steam64;


    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players?nickname="+DiscordMessage.savedArgs))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitAPI::parse)
                .join();

                faceitStats.main(null);
    }
    public static String parse(String responseBody) {

        JSONObject obj = new JSONObject(responseBody);
        String n = obj.getString("player_id");
        String c = obj.getString("country");
        String a = obj.getString("avatar");
        Integer e = obj.getJSONObject("games").getJSONObject("csgo").getInt("faceit_elo");
        Integer l = obj.getJSONObject("games").getJSONObject("csgo").getInt("skill_level");
        int z = obj.getJSONObject("infractions").getInt("leaver");
        int h = obj.getJSONObject("infractions").getInt("afk");
        steam64 = obj.getString("steam_id_64");
        String j = obj.getString("faceit_url");
        JSONArray k = obj.getJSONArray("memberships");
        premium = k.getString(0);
        profileURL = j.replaceAll("lang", "en")
                .replace("{", "")
                .replace("}", "");

        System.out.println(n + " " + c+" "+premium+" "+profileURL);
        faceitplayerID = n;
        faceitplayerCountry = c;
        faceitAvatar = a;
        faceitLevel = l;
        faceitElo = e;
        faceitAfk = h;
        faceitLeave = z;

        return null;

    }
}
