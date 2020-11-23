import org.json.JSONObject;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class faceitPlayersearch {
    public static String id;
    public static String nickname;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/search/players?nickname=" + URLEncoder.encode(DiscordMessage.savedArgs, StandardCharsets.UTF_8) + "&game=csgo&offset=0&limit=1"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitPlayersearch::parse)
                .join();


    }
    public static String parse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        nickname = obj.getJSONArray("items").getJSONObject(0).getString("nickname");
        id = obj.getJSONArray("items").getJSONObject(0).getString("player_id");

        return null;
    }

}
