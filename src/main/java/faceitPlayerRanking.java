import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.NumberFormat;
import java.util.Locale;

public class faceitPlayerRanking {
    public static String regionRank;
    public static String countryRank;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/rankings/games/csgo/regions/"+faceitAPI.region.toUpperCase()+"/players/"+faceitAPI.faceitplayerID+"?limit=1"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitPlayerRanking::parse)
                .join();

        HttpRequest test = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/rankings/games/csgo/regions/"+faceitAPI.region.toUpperCase()+"/players/"+faceitAPI.faceitplayerID+"?country="+faceitAPI.faceitplayerCountry+"&limit=1"))
                .build();
        client.sendAsync(test, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitPlayerRanking::testing)
                .join();


    }
    public static String parse(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        regionRank = NumberFormat.getNumberInstance(Locale.US).format(obj.getInt("position"));
        System.out.println(regionRank);

        return null;
    }
    public static String testing(String responseBody) {
        JSONObject obj = new JSONObject(responseBody);
        countryRank = NumberFormat.getNumberInstance(Locale.US).format(obj.getInt("position"));
        System.out.println(countryRank);
        return null;
    }
}
