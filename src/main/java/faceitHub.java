import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletionException;

public class faceitHub {
    public static String hubid;
    public static String name;
    public static String icon;
    public static String desc;
    public static int playersc;
    public static String topr;
    public static String perm;
    public static int mins;
    public static int maxs;
    public static String link;
    public static String working;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/search/hubs?name="+DiscordMessage.hub+"&offset=0&limit=1"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitHub::parse)
                .join();
    }
    public static void mainhub(String args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/hubs/"+args))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitHub::parsemain)
                .join();
    }
    public static void hubrank(String args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/leaderboards/hubs/"+args+"/general?offset=0&limit=10"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitHub::parserank)
                .join();
    }
    public static String parse(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        JSONArray array = obj.getJSONArray("items");
        JSONObject test = array.getJSONObject(0);
        hubid = test.getString("competition_id");
        mainhub(hubid);
        try{
            hubrank(hubid);
        }catch (CompletionException g){
            System.out.println("couldnt load leaderboard");
            working = "false";
        }


        return null;
    }
    public static String parsemain(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        name = obj.getString("name");
        try {
            icon = obj.getString("avatar");
        }catch (CompletionException ignored){}

        desc = obj.getString("description");
        playersc = obj.getInt("players_joined");
        perm = obj.getString("join_permission");
        link = obj.getString("faceit_url");
        mins = obj.getInt("min_skill_level");
        maxs = obj.getInt("max_skill_level");

        link = link.replaceAll("lang", "en")
                .replace("{", "")
                .replace("}", "");

        return null;
    }
    public static String parserank(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        JSONArray it = obj.getJSONArray("items");
        StringBuilder ept = new StringBuilder();
        for(int i = 0; i<= 9; i++) {
            JSONObject test = it.getJSONObject(i);
            int played = test.getInt("played");
            double winrate = test.getDouble("win_rate");
            JSONObject pl = test.getJSONObject("player");
            String namet = pl.getString("nickname");
            namet = "***"+namet+"***";
            int lvlt = test.getInt("points");
            ept.append(i+1+". "+namet+": "+"Points: "+lvlt+" | "+ "Played Matches: "+played+" | "+"Winrate: "+winrate+"\n");

        }
        topr = (ept.toString());
        working = "true";
        return null;
    }

}
