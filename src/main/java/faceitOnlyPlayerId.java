import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class faceitOnlyPlayerId {
    public static String faceitplayerID;
    public static String faceitAva;

    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players?nickname=" + DiscordMessage.savedArgs))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitOnlyPlayerId::parse)
                .join();

    }

    public static String parse(String responseBody) {

        JSONObject obj = new JSONObject(responseBody);
        String n = obj.getString("player_id");
        String a = obj.getString("avatar");
        faceitplayerID = n;
        faceitAva = a;
        return null;
    }
}
