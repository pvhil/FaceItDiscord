import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.Month;
import java.time.Period;

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
    public static void fpleu() {
        LocalDate bday = LocalDate.of(2021, Month.JANUARY, 1);
        LocalDate today = LocalDate.now();
        Period age = Period.between(bday, today);
        int years = age.getYears();
        int months = age.getMonths();

        int season = (years * 12) + months + 41;


        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/leaderboards/hubs/74caad23-077b-4ef3-8b1d-c6a2254dfa75/seasons/" + season + "?offset=0&limit=15"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitRanking::fplparse)
                .join();
    }
    public static void fplus() {
        LocalDate bday = LocalDate.of(2021, Month.JANUARY, 1);
        LocalDate today = LocalDate.now();
        Period age = Period.between(bday, today);
        int years = age.getYears();
        int months = age.getMonths();

        int season = (years * 12) + months + 34;
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/leaderboards/hubs/748cf78c-be73-4eb9-b131-21552f2f8b75/seasons/" + season + "?offset=0&limit=15"))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitRanking::fplparse)
                .join();
    }

    public static String parse(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        JSONArray it = obj.getJSONArray("items");
        StringBuilder ept = new StringBuilder();
        for(int i = 0; i< 15; i++) {
            JSONObject test = it.getJSONObject(i);
            String namet = test.getString("nickname");
            namet = "***"+namet+"***";
            int elot = test.getInt("faceit_elo");
            int lvlt = test.getInt("game_skill_level");
            ept.append(i+1+". "+namet+": "+"Elo: "+elot+" | "+"Level: "+lvlt+ "\n");

        }
        topr = (ept.toString());
        return null;
    }
    public static String fplparse(String responseBody){
        JSONObject obj = new JSONObject(responseBody);
        JSONArray it = obj.getJSONArray("items");
        StringBuilder ept = new StringBuilder();
        for(int i = 0; i< 15; i++) {
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
        return null;
    }
}

