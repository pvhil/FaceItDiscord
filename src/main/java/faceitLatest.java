import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;

public class faceitLatest {
    public static String team1;
    public static String team2;
    public static String players1;
    public static String players2;
    public static String latestGameURL;
    public static String gameWinner;
    public static String matchID;
    public static String isitWin = "false";
    public static Date matchTime;

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                .GET()
                .header("accept", "application/json")
                .header("Authorization", "Bearer "+main.FACEITTOKEN)
                .uri(URI.create("https://open.faceit.com/data/v4/players/"+faceitOnlyPlayerId.faceitplayerID+"/history?game=csgo&offset=0&limit="+DiscordMessage.savedCounter))
                .build();
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(faceitLatest::parse)
                .join();
    }
    private static boolean userexists(JSONObject jsonArray, String usernameToFind) {
        return jsonArray.toString().contains("\"player_id\":\""+usernameToFind+"\"");
    }
    //needs rewrite in future
    public static String parse(String responseBody) {
        JSONObject values = new JSONObject(responseBody);
        JSONArray themap = values.getJSONArray("items");
        JSONObject map = themap.getJSONObject(DiscordMessage.savedCounter - 1);
        JSONObject xx = map.getJSONObject("teams");
        String link = map.getString("faceit_url");
        JSONObject frac1 = xx.getJSONObject("faction1");
        JSONObject frac2 = xx.getJSONObject("faction2");
        String t2 = frac2.getString("nickname");
        String t1  = frac1.getString("nickname");
        JSONArray pplayers1 = frac1.getJSONArray("players");
        JSONArray pplayers2 = frac2.getJSONArray("players");
        JSONObject wWin = map.getJSONObject("results");
        String wwinner = wWin.getString("winner");
        matchID = map.getString("match_id");
        matchTime = new Date(Long.parseLong(String.valueOf(map.getInt("started_at")))*1000);


        StringBuilder sb1 = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            JSONObject a1 = pplayers2.getJSONObject(i);
            JSONObject a = pplayers1.getJSONObject(i);
            if(wwinner.equalsIgnoreCase("faction1")){
                if(userexists(a,faceitOnlyPlayerId.faceitplayerID)){
                    System.out.println("its working");
                    isitWin = "true";
                }else {
                    System.out.println("could work");

                }
            }
            if(wwinner.equalsIgnoreCase("faction2")){
                if(userexists(a1,faceitOnlyPlayerId.faceitplayerID)){
                    System.out.println("its working");
                    isitWin = "true";
                }else {
                    System.out.println("could work");

                }
            }



            String player1 = a.getString("nickname");
            if(player1.startsWith("_")||player1.startsWith("*")&&!player1.contains(DiscordMessage.savedArgs)){
                player1 = player1.replace("*","\\*");
                player1 = player1.replace("_","\\_");
            }
            if(player1.contains(DiscordMessage.savedArgs)){
                player1 = "***"+player1+"***";
                System.out.println(player1);
            }
            sb1.append(player1 +"\n ");


        }
        String pp1 = sb1.toString();
        StringBuilder sb2 = new StringBuilder();
        for (int i = 0; i < 5; i++){
            JSONObject a = pplayers2.getJSONObject(i);
            String player2 = a.getString("nickname");
            if(player2.startsWith("_")||player2.startsWith("*")&&!player2.contains(DiscordMessage.savedArgs)){
                player2 = player2.replace("*","\\*");
                player2 = player2.replace("_","\\_");
            }
            if(player2.contains(DiscordMessage.savedArgs)){
                player2 = "***"+player2+"***";
                System.out.println(player2);
            }
            sb2.append(player2+"\n ");
        }
        String pp2 = sb2.toString();
            team1 = t1;
            team2 = t2;
            players2 = pp2;
            players1 = pp1;
            gameWinner = wwinner;
            latestGameURL = link.replaceAll("lang", "en")
                    .replace("{", "")
                    .replace("}", "");
        System.out.println(t1+ " "+ pp1+" "+t2+" "+pp2 +"  "+latestGameURL+" "+ gameWinner);
        faceitdetailedMatch.main(null);
            return null;

        }
}
