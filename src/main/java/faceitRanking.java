import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitRanking {
    public static String topr;
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/rankings/games/csgo/regions/"+DiscordMessage.savedRegion+"?offset=0&limit=15"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitRanking::parse)
                .join();
    }
    public static void country() {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/rankings/games/csgo/regions/"+DiscordMessage.savedRegion+"?country="+DiscordMessage.savedCountry+"&offset=0&limit=15"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitRanking::parse)
                .join();
    }

    public static String parse(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        JSONArray it = obj.getJSONArray("items");
        StringBuilder ept = new StringBuilder();
        for(int i = 0; i< 15; i++) {
            JSONObject test = it.getJSONObject(i);
            String namet = test.getString("nickname");
            int elot = test.getInt("faceit_elo");
            int lvlt = test.getInt("game_skill_level");
            ept.append(i+1+". "+namet+" "+"Elo: "+elot+" "+"Level: "+lvlt+ "\n");

        }
        topr = (ept.toString());
        return null;
    }
}

