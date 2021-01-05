import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class faceitOthergames {
    public static String steam64;
    public static String playerid;
    public static String country;
    public static String avatar;
    public static String premium;
    public static String profileURL;
    public static int elo;
    public static String region;
    public static int lvl;
    public static String faceitWins;
    public static String faceitRate;
    public static String faceitKD;
    public static String faceitLongest;
    public static JSONArray faceitRecent;
    public static String headshotperc;
    public static String longestwins;


    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players?nickname=" + URLEncoder.encode(DiscordMessage.savedArgs, StandardCharsets.UTF_8)))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitOthergames::parse)
                .join();

    }

    public static String parse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        playerid = obj.getString("player_id");
        country = obj.getString("country");
        avatar = obj.getString("avatar");
        steam64 = obj.getString("steam_id_64");
        String j = obj.getString("faceit_url");
        JSONArray k = obj.getJSONArray("memberships");
        premium = k.getString(0);
        profileURL = j.replaceAll("lang", "en")
                .replace("{", "")
                .replace("}", "");
        elo = obj.getJSONObject("games").getJSONObject(DiscordMessage.otherGame).getInt("faceit_elo");
        region = obj.getJSONObject("games").getJSONObject(DiscordMessage.otherGame).getString("region");
        lvl = obj.getJSONObject("games").getJSONObject(DiscordMessage.otherGame).getInt("skill_level");


        return null;
    }

    public static void dotastats(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/" + faceitOnlyPlayerId.faceitplayerID + "/stats/dota2"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitOthergames::parsedota)
                .join();


    }

    public static String parsedota(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        String a = obj.getJSONObject("lifetime").getString("Matches");
        String b = obj.getJSONObject("lifetime").getString("Win Rate %");
        String c = obj.getJSONObject("lifetime").getString("Average K/D Ratio");
        String d = obj.getJSONObject("lifetime").getString("Longest Win Streak");
        JSONArray e = obj.getJSONObject("lifetime").getJSONArray("Recent Results");
        longestwins = obj.getJSONObject("lifetime").getString("Longest Win Streak");
        headshotperc = obj.getJSONObject("lifetime").getString("Average Gold/minute");

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

    public static void pubgstats(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/" + faceitOnlyPlayerId.faceitplayerID + "/stats/pubg"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitOthergames::parsepubg)
                .join();


    }

    public static String parsepubg(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        String a = obj.getJSONObject("lifetime").getString("Wins");
        String b = obj.getJSONObject("lifetime").getString("Headshot (%)");
        String c = obj.getJSONObject("lifetime").getString("K/D Ratio");
        String d = obj.getJSONObject("lifetime").getString("Win Rate");
        JSONArray e = obj.getJSONObject("lifetime").getJSONArray("Recent Placements");
        longestwins = obj.getJSONObject("lifetime").getString("Total Kills");
        headshotperc = obj.getJSONObject("lifetime").getString("Top 10 Finish");

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
