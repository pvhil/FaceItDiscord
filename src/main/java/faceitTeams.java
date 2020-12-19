import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class faceitTeams {
    public static String teamid;
    public static String teamname;
    public static String teampic;
    public static String[] name = null;
    public static String[] country = null;
    public static String[] link = null;
    public static String teamdesc;
    public static String teamurl;
    public static int memlength;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/search/teams?nickname=" + URLEncoder.encode(DiscordMessage.hub, StandardCharsets.UTF_8) + "&offset=0&limit=1"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitTeams::parse)
                .join();
    }

    public static String parse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        teamid = obj.getJSONArray("items").getJSONObject(0).getString("team_id");
        teamtest(null);
        return null;

    }

    public static void teamtest(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/teams/" + teamid))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitTeams::teamparse)
                .join();
    }

    public static String teamparse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        teamname = obj.getString("nickname");
        teampic = obj.getString("avatar");
        teamdesc = obj.getString("description");
        teamurl = obj.getString("faceit_url");

        JSONArray members = obj.getJSONArray("members");
        memlength = members.length();
        StringBuilder names = new StringBuilder();
        StringBuilder countries = new StringBuilder();
        StringBuilder links = new StringBuilder();

        for (int i = 0; i < memlength; i++) {
            names.append(members.getJSONObject(i).getString("nickname") + ";");
            countries.append(members.getJSONObject(i).getString("country") + ";");
            links.append(members.getJSONObject(i).getString("faceit_url") + ";");
        }
        name = names.toString().split(";");
        country = countries.toString().split(";");
        String testlink = links.toString();
        System.out.println(Arrays.toString(name));

        testlink = testlink.replaceAll("lang", "en")
                .replace("{", "")
                .replace("}", "");
        link = testlink.split(";");

        teamurl = teamurl.replaceAll("lang", "en")
                .replace("{", "")
                .replace("}", "");

        if (teamdesc == null) {
            teamdesc = " ";
        }


        return null;
    }


}
