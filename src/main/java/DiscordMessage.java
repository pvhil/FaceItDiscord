import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.TextChannel;
import net.dv8tion.jda.api.events.guild.GuildJoinEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.io.IOException;
import java.text.NumberFormat;
import java.util.Objects;
import java.util.concurrent.CompletionException;

import static net.dv8tion.jda.api.OnlineStatus.*;

public class DiscordMessage extends ListenerAdapter implements EventListener {

    public static String savedArgs;
    public static String savedMap;
    public static String savedRegion;
    public static String savedCountry;
    public static String faceitLevelPNG;
    public static String mapCode;
    public static String plsStop;
    public static int savedCounter;
    public EmbedBuilder search = new EmbedBuilder();
    public Message toSend;

    public String countryCodeToEmoji(String code) {
        int OFFSET = 127397;
        if (code == null || code.length() != 2) {
            return "";
        }
        if (code.equalsIgnoreCase("uk")) {
            code = "gb";
        }
        code = code.toUpperCase();
        StringBuilder emojiStr = new StringBuilder();
        for (int i = 0; i < code.length(); i++) {
            emojiStr.appendCodePoint(code.charAt(i) + OFFSET);
        }
        return emojiStr.toString();
    }
    public void unvalidPlayer(){
        faceitPlayersearch.main(null);
        search.setTitle("The Player you searched does not exist");
        search.addField("Loading this Player: ","```"+faceitPlayersearch.nickname+"```", false);
        search.setFooter("Remember the FaceIT name is case-sensitive!");
        faceitAPI.faceitplayerID = faceitPlayersearch.id;
        faceitOnlyPlayerId.faceitplayerID = faceitPlayersearch.id;
        savedArgs = faceitPlayersearch.nickname;
    }
    public void onGuildJoin(GuildJoinEvent event){
        //joinevent
        Guild guild = event.getGuild();
        TextChannel channel = guild.getDefaultChannel();

        Objects.requireNonNull(Objects.requireNonNull(main.jda.getGuildById("742408927022546975")).getTextChannelById("773217090924314694")).sendMessage("*"+event.getGuild().getName()+"*"+" now uses the bot").queue();
        EmbedBuilder join = new EmbedBuilder();
        join.setAuthor("Thanks for adding the FaceIT-Stats Bot!");
        join.setColor(0xe6851e);
        join.setThumbnail("https://images.discordapp.net/avatars/770312130037153813/704aab707701ace86dd8e737800b4521.png?size=512");
        join.setFooter("Bot made with love by phil#0346", "https://cdn.discordapp.com/avatars/208226733789282304/80c3394993bb882de40259ee52202c44.webp?size=128");
        join.addField("> .faceit <name> ","Shows your alltime FaceIT Stats", false);
        join.addField("> .faceit <name> latest (opt: number)"," Shows your Stats from your latest game\nWith a given number you can look at your for ex. second latest game (*.faceit latest <name> 2*)", false);
        join.addField("> .faceit <name> <map> "," Shows your performance in a specific map", false);
        join.addField("> .faceit <name> last (amount of games) "," Shows your Stats for your last games (standard: 15)", false);
        join.addField("> .faceitrank <region> (opt: country): "," Top 15 for your Region/Country", false);
        join.addField("> Please vote for our Bot: "," [Click Here to Vote!](https://top.gg/bot/770312130037153813/vote)", false);
        Objects.requireNonNull(channel).sendMessage(join.build()).queue();
    }

    public void onMessageReceived(MessageReceivedEvent event) {
        java.lang.String[] args = event.getMessage().getContentRaw().split("\\s+");
        //admin
        if (args[0].equalsIgnoreCase(".faceitadminstats")){
            if(event.getAuthor().getId().equals("208226733789282304")){
                if (args.length == 1) {
                    EmbedBuilder adminstats = new EmbedBuilder();
                    adminstats.setTitle("Stats for the Bot")
                            .setAuthor("Hello phil :)")
                            .addField("Servers: ", String.valueOf(main.jda.getGuilds().size()), true)
                            .addField("Users: ", String.valueOf(main.jda.getUsers().size()), true)
                            .addField("Free Ram: ", NumberFormat.getInstance().format(Runtime.getRuntime().freeMemory() / 1024) + " mb", true)
                            .setColor(0x1500ff);
                    event.getChannel().sendMessage(adminstats.build()).queue();
                }
                if(args.length >= 2 ){
                    if(args[1].equalsIgnoreCase("presence")){
                        String activity = args[2];
                        String activity1 = args[3];
                        if (activity.equalsIgnoreCase("reset")){
                            main.jda.getPresence().setActivity(Activity.watching(".faceithelp"));
                        }else {
                            main.jda.getPresence().setActivity(Activity.watching(activity + " " + activity1 + " | .faceithelp"));
                        }
                    }
                    if(args[1].equalsIgnoreCase("status")){
                        String activity = args[2];
                        if(activity.equalsIgnoreCase("away")) {
                            main.jda.getPresence().setStatus(IDLE);
                            event.getChannel().sendMessage("Bot is now idle").queue();
                        }
                        if(activity.equalsIgnoreCase("online")) {
                            main.jda.getPresence().setStatus(ONLINE);
                            event.getChannel().sendMessage("Bot is online").queue();
                        }
                        if(activity.equalsIgnoreCase("busy")) {
                            main.jda.getPresence().setStatus(DO_NOT_DISTURB);
                            event.getChannel().sendMessage("Bot is now busy").queue();
                        }
                        if(activity.equalsIgnoreCase("offline")) {
                            main.jda.getPresence().setStatus(INVISIBLE);
                            event.getChannel().sendMessage("Bot made invisible").queue();
                        }
                    }
                    if(args[1].equalsIgnoreCase("constructionmode")){
                        if(args[2].equalsIgnoreCase("off")){
                            main.jda.getPresence().setStatus(ONLINE);
                            main.jda.getPresence().setActivity(Activity.watching(" .faceithelp"));
                        } else {
                            main.jda.getPresence().setStatus(DO_NOT_DISTURB);
                            main.jda.getPresence().setActivity(Activity.watching("BOT IS IN DEVELOPMENT"));
                        }
                    }
                }
            }
        }
        if (args[0].equalsIgnoreCase(".faceithelp")) {
            EmbedBuilder help = new EmbedBuilder();
            help.setTitle("How to use the Bot:");
            help.setColor(0xe6851e);
            help.setThumbnail("https://images.discordapp.net/avatars/770312130037153813/704aab707701ace86dd8e737800b4521.png?size=512");
            help.setFooter("Bot made with love by phil#0346", "https://cdn.discordapp.com/avatars/208226733789282304/80c3394993bb882de40259ee52202c44.webp?size=128");
            help.addField("> .faceit <name> ","Shows your alltime FaceIT Stats", false);
            help.addField("> .faceit <name> latest (opt: number)"," Shows your Stats from your latest game\nWith a given number you can look at your for ex. second latest game (*.faceit latest <name> 2*)", false);
            help.addField("> .faceit <name> <map> "," Shows your performance in a specific map", false);
            help.addField("> .faceit <name> last (amount of games) "," Shows your Stats for your last games (standard: 15)", false);
            help.addField("> .faceitrank <region> (opt: country): "," Top 15 for your Region/Country", false);
            help.addField("> Please vote for our Bot: "," [Click Here to Vote!](https://top.gg/bot/770312130037153813/vote)", false);
            event.getChannel().sendMessage(help.build()).queue();
            return;
        }
        //extra: rank
        if (args[0].equalsIgnoreCase(".faceitrank")) {
            if(args.length >= 2) {
                savedRegion = args[1].toUpperCase();
                if(args.length ==3) {
                    savedCountry = args[2].toLowerCase();
                }
                event.getChannel().sendMessage("*loading top 15*").queue();
                EmbedBuilder ranks = new EmbedBuilder();
                try {
                    if (savedCountry == null) {
                        savedCountry = "";
                        faceitRanking.main(null);
                        ranks.setThumbnail("https://www.countryflags.io/"+savedRegion+"/flat/64.png");
                    } else {
                        faceitRanking.country();
                        ranks.setThumbnail("https://www.countryflags.io/"+savedCountry+"/flat/64.png");
                    }
                } catch (CompletionException e) {
                    e.printStackTrace();
                    event.getChannel().sendMessage("Wrong Region or Country!").queue();
                    return;
                }
                ranks.setTitle("Top 15 for " + savedRegion+" "+savedCountry);
                ranks.setDescription(faceitRanking.topr);
                ranks.setColor(0xe6851e);


                event.getChannel().sendMessage(ranks.build()).queue();
                savedCountry = null;
            } else {
                event.getChannel().sendMessage("Please Use a region like *eu* , *us*").queue();
                savedCountry = null;
            }
        }

        //Normal User
        if (args[0].equalsIgnoreCase(".faceit")) {
            if (args.length < 2) {
                event.getChannel().sendMessage("Dont forget Faceit Name!").queue();
            }
            if (args.length == 2) {
                event.getChannel().sendMessage("*loading faceit Stats*").queue();

                savedArgs = args[1];
                try {
                    faceitAPI.main(null);
                } catch (IOException e) {
                    e.printStackTrace();
                    event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                } catch (InterruptedException | CompletionException e) {
                    try {
                        unvalidPlayer();
                    }catch (CompletionException e1){
                        event.getChannel().sendMessage("Wrong FaceIT Name!");
                        return;
                    }
                    event.getChannel().sendMessage(search.build()).queue( message -> toSend = message);
                    search.clearFields();
                    try {
                        faceitAPI.main(null);
                    } catch (IOException | InterruptedException g) {
                        g.printStackTrace();
                        event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                    }
                }


                if (faceitAPI.faceitLevel == 1) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_1.png";
                }
                if (faceitAPI.faceitLevel == 2) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_2.png";
                }
                if (faceitAPI.faceitLevel == 3) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_3.png";
                }
                if (faceitAPI.faceitLevel == 4) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_4.png";
                }
                if (faceitAPI.faceitLevel == 5) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_5.png";
                }
                if (faceitAPI.faceitLevel == 6) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_6.png";
                }
                if (faceitAPI.faceitLevel == 7) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_7.png";
                }
                if (faceitAPI.faceitLevel == 8) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_8.png";
                }
                if (faceitAPI.faceitLevel == 9) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_9.png";
                }
                if (faceitAPI.faceitLevel == 10) {
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_10.png";
                }


                EmbedBuilder info = new EmbedBuilder();
                info.setAuthor("Elo: " + faceitAPI.faceitElo, null, faceitLevelPNG);
                if(faceitAPI.premium.equals("free")) {
                    info.setTitle("Stats for " + savedArgs);
                }else {
                    info.setTitle("Stats for Premium Member " + savedArgs);
                }
                info.setDescription("[FaceIT Profile]("+faceitAPI.profileURL+") and [Steam Profile](https://steamcommunity.com/profiles/"+faceitAPI.steam64+")");
                try {
                    info.setThumbnail(faceitAPI.faceitAvatar);
                }catch (IllegalArgumentException e){
                    System.out.println("no pic");
                }
                info.addField("Country: ", countryCodeToEmoji(faceitAPI.faceitplayerCountry), true);
                info.addField("Wins: ", faceitStats.faceitWins, true);
                info.addField("Winrate: ", faceitStats.faceitRate + "%", true);
                info.addField("K/D: ", faceitStats.faceitKD, true);
                info.addField("Longest Winstreak", faceitStats.longestwins+" Wins", true);
                info.addField("Last 5 Games: ", String.valueOf(faceitStats.faceitRecent).replace("[", "").replaceAll(",", "").replace("]", "").replaceAll("1", "\uD83C\uDFC6").replaceAll("0", "\u274C").replaceAll("\"", ""), true);
                info.addField("Headshot %: ", faceitStats.headshotperc+"%", true);
                info.addField("AFK / Left early: ", faceitAPI.faceitAfk + " / " + faceitAPI.faceitLeave, true);
                info.setFooter("\uD83C\uDF10 Rank: "+faceitPlayerRanking.regionRank+" | "+countryCodeToEmoji(faceitAPI.faceitplayerCountry)+" Rank: "+faceitPlayerRanking.countryRank);
                info.setColor(0xe6851e);

                event.getChannel().sendMessage(info.build()).queue();
                toSend.delete().queue();
                //faceitRecent faceitLongest faceitKD faceitRate faceitWins faceitLevel faceitElo tofu


                System.out.println(savedArgs + " stats action");

            }
            if (args.length >= 3) {
                savedArgs = args[1];
                savedMap = args[2];
                if (savedMap.equalsIgnoreCase("latest")) {
                    savedCounter = 1;
                    if(args.length==4){
                        savedCounter = Integer.parseInt(args[3]);
                        event.getChannel().sendMessage("*loading "+savedCounter+". Match from now*").queue();
                    }else {
                        event.getChannel().sendMessage("*loading latest Match*").queue();
                    }
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        try {
                            faceitOnlyPlayerId.main(null);
                        } catch (InterruptedException | CompletionException l) {
                            try {
                                unvalidPlayer();
                            }catch (CompletionException e1){
                                event.getChannel().sendMessage("Wrong FaceIT Name!");
                                return;
                            }
                            event.getChannel().sendMessage(search.build()).queue( message -> toSend = message);
                            search.clearFields();
                            try {
                                faceitOnlyPlayerId.main(null);
                            } catch (InterruptedException g) {
                                g.printStackTrace();
                                event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                            }
                        }

                    }

                    try {
                        faceitLatest.main(null);
                    }catch (CompletionException e){
                        event.getChannel().sendMessage("Something did not work. Maybe User never played csgo or given number is too high.").queue();
                    }
                    EmbedBuilder latestem = new EmbedBuilder();
                    latestem.setTitle(faceitLatest.team1 + " vs " + faceitLatest.team2, null);
                    latestem.addField("Team 1: ", faceitLatest.players1, true);
                    latestem.addField("Team 2: ", faceitLatest.players2, true);
                    latestem.addField("", " ", false);
                    latestem.addField("Final Score: ", faceitdetailedMatch.endScore, true);
                    latestem.addField("Map: ", faceitdetailedMatch.theMap, true);

                    latestem.addField("", " ", false);
                    latestem.addField("Kills: ", faceitdetailedMatch.kills, true);
                    latestem.addField("Deaths: ", faceitdetailedMatch.deaths, true);
                    latestem.addField("K/D: ", faceitdetailedMatch.kdratio, true);
                    latestem.addField("Triple Kills: ", faceitdetailedMatch.tripleKills, true);
                    latestem.addField("Quadro Kills: ", faceitdetailedMatch.quadroKills, true);
                    latestem.addField("Aces: ", faceitdetailedMatch.pentaKills, true);
                    latestem.addField("Assists: ", faceitdetailedMatch.assists, true);
                    latestem.addField("Headshots: ", faceitdetailedMatch.headshots, true);
                    latestem.addField("MVPs: ", faceitdetailedMatch.mvps, true);

                    latestem.setFooter("Match played at "+ faceitLatest.matchTime, "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/clock.png");
                    latestem.setDescription("[Link to Game]("+faceitLatest.latestGameURL+")");

                    if (faceitLatest.isitWin.equals("true")) {
                        latestem.setColor(0x09ff00);
                        latestem.setThumbnail("https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/win.png");
                    } else {
                        latestem.setColor(0xff0000);
                        latestem.setThumbnail("https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/lose.png");
                    }

                    event.getChannel().sendMessage(latestem.build()).queue();
                    toSend.delete().queue();
                    faceitLatest.players1 = null;
                    faceitLatest.players2 = null;
                    faceitLatest.latestGameURL = null;
                    faceitLatest.gameWinner = null;
                    faceitLatest.team1 = null;
                    faceitLatest.team2 = null;
                    faceitOnlyPlayerId.faceitplayerID = null;
                    faceitLatest.isitWin = "false";


                } else if (savedMap.equalsIgnoreCase("dust2") || savedMap.equalsIgnoreCase("mirage") || savedMap.equalsIgnoreCase("train") || savedMap.equalsIgnoreCase("cache") || savedMap.equalsIgnoreCase("overpass") || savedMap.equalsIgnoreCase("vertigo") || savedMap.equalsIgnoreCase("inferno") || savedMap.equalsIgnoreCase("nuke")) {
                    event.getChannel().sendMessage("*loading map stats*").queue();
                    plsStop ="false";
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        try {
                            faceitOnlyPlayerId.main(null);
                        } catch (InterruptedException | CompletionException l) {
                            try {
                                unvalidPlayer();
                            }catch (CompletionException e1){
                                event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                                return;
                            }
                            event.getChannel().sendMessage(search.build()).queue( message -> toSend = message);
                            search.clearFields();
                            try {
                                faceitOnlyPlayerId.main(null);
                            } catch (InterruptedException g) {
                                g.printStackTrace();
                                event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                            }
                        }

                    }
                    if (savedMap.equalsIgnoreCase("dust2")) {
                        mapCode = "de_dust2";
                    }
                    if (savedMap.equalsIgnoreCase("mirage")) {
                        mapCode = "de_mirage";
                    }
                    if (savedMap.equalsIgnoreCase("train")) {
                        mapCode = "de_train";
                    }
                    if (savedMap.equalsIgnoreCase("cache")) {
                        mapCode = "de_cache";
                    }
                    if (savedMap.equalsIgnoreCase("overpass")) {
                        mapCode = "de_overpass";
                    }
                    if (savedMap.equalsIgnoreCase("vertigo")) {
                        mapCode = "de_vertigo";
                    }
                    if (savedMap.equalsIgnoreCase("inferno")) {
                        mapCode = "de_inferno";
                    }
                    if (savedMap.equalsIgnoreCase("nuke")) {
                        mapCode = "de_nuke";
                    }

                    try {
                        faceitMaps.main(null);
                    }catch (CompletionException e){
                        event.getChannel().sendMessage("Something went wrong. Maybe User never played csgo?").queue();
                        return;
                    }
                    EmbedBuilder mapem = new EmbedBuilder();
                    mapem.setTitle("Stats for " + savedMap);
                    mapem.addField("Kills: ", faceitMaps.allkills, true);
                    mapem.addField("Deaths: ", faceitMaps.alldeaths, true);
                    mapem.addField("Assists: ", faceitMaps.assists, true);
                    mapem.addField("Average Kills", faceitMaps.avgKills, true);
                    mapem.addField("Average Deaths", faceitMaps.avgDeaths, true);
                    mapem.addField("Played Rounds", faceitMaps.playedRounds, true);
                    mapem.addField("Matches: ", faceitMaps.matches, true);
                    mapem.addField("Wins: ", faceitMaps.wins, true);
                    mapem.addField("Winrate: ", faceitMaps.winrate + "%", true);
                    mapem.addField("Triple Kills: ", faceitMaps.triplekills, true);
                    mapem.addField("Quadro Kills: ", faceitMaps.quadrokills, true);
                    mapem.addField("Aces: ", faceitMaps.pentakills, true);
                    mapem.addField("Headshots: ", faceitMaps.headshots, true);
                    mapem.addField("Headshots per Match: ", faceitMaps.headshotspermatch, true);
                    mapem.addField("Average K/D: ", faceitMaps.avgkd, true);
                    mapem.addField("MVPs: ", faceitMaps.mvps, true);
                    mapem.setThumbnail(faceitMaps.mappicture);
                    mapem.setColor(0xe6851e);


                        event.getChannel().sendMessage(mapem.build()).queue();
                        toSend.delete().queue();
                        faceitOnlyPlayerId.faceitplayerID = null;



                } else if (savedMap.startsWith("last")||savedMap.equalsIgnoreCase("last")) {
                    if(savedMap.length()==4){
                        savedCounter = 15;
                    } else {
                        String[] split = savedMap.split("t");
                        savedCounter = Integer.parseInt(split[1]);
                        if(savedCounter>=100){
                            event.getChannel().sendMessage("You can max. load 99 Games!").queue();
                            return;
                        }
                    }
                    if(savedMap.equalsIgnoreCase("last")&& (args.length ==4)){
                            savedCounter = Integer.parseInt(args[3]);
                        if(savedCounter>=100){
                            event.getChannel().sendMessage("You can max. load 99 Games!").queue();
                            return;
                        }
                    }
                    StringBuilder hello = new StringBuilder();
                    hello.append("\"\",".repeat(Math.max(0, savedCounter)));
                    event.getChannel().sendMessage("*loading last "+savedCounter+" games*").queue();
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        try {
                            faceitOnlyPlayerId.main(null);
                        } catch (InterruptedException | CompletionException l) {
                            try {
                                unvalidPlayer();
                            }catch (CompletionException e1){
                                event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                                return;
                            }
                            event.getChannel().sendMessage(search.build()).queue( message -> toSend = message);
                            search.clearFields();
                            try {
                                faceitOnlyPlayerId.main(null);
                            } catch (InterruptedException g) {
                                g.printStackTrace();
                                event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                            }
                        }

                    }

                    try {
                        faceitLast20EloPoints.main(null);
                    }catch (CompletionException e){
                        event.getChannel().sendMessage("Something did not work. Maybe User never played csgo or amount of games is too high for this player").queue();
                        e.printStackTrace();
                        faceitOnlyPlayerId.faceitplayerID = null;
                        faceitLast20EloPoints.totalsumkills = 0;
                        faceitLast20EloPoints.totalsumdeaths = 0;
                        faceitLast20EloPoints.totalsumkd = 0;
                        faceitLast20EloPoints.realkd = "0";
                        faceitLast20EloPoints.totalsumassists = 0;
                        faceitLast20EloPoints.totalsummvps = 0;
                        faceitLast20EloPoints.totalsumheadshots = 0;
                        faceitLast20EloPoints.totalsumtriple = 0;
                        faceitLast20EloPoints.totalsumquadro = 0;
                        faceitLast20EloPoints.totalsumace = 0;
                        faceitLast20EloPoints.win = 0;
                        return;
                    }

                    EmbedBuilder last = new EmbedBuilder();
                    last.setTitle("Stats for your last "+savedCounter+" Games");
                    try {
                        last.setThumbnail(faceitOnlyPlayerId.faceitAva);
                    }catch (IllegalArgumentException e){
                        System.out.println("no pic");
                    }
                    last.addField("Average Kills", String.valueOf(faceitLast20EloPoints.totalsumkills/savedCounter), true);
                    last.addField("Average Death", String.valueOf(faceitLast20EloPoints.totalsumdeaths/savedCounter), true);
                    last.addField("Average K/D", String.valueOf(faceitLast20EloPoints.realkd), true);
                    last.addField("Average Assists", String.valueOf(faceitLast20EloPoints.totalsumassists/savedCounter), true);
                    last.addField("Average MVPs", String.valueOf(faceitLast20EloPoints.totalsummvps/savedCounter), true);
                    last.addField("Average Headshots", String.valueOf(faceitLast20EloPoints.totalsumheadshots/savedCounter), true);
                    last.addField("Triple Kills", String.valueOf(faceitLast20EloPoints.totalsumtriple), true);
                    last.addField("Quadro Kills", String.valueOf(faceitLast20EloPoints.totalsumquadro), true);
                    last.addField("Aces", String.valueOf(faceitLast20EloPoints.totalsumace), true);
                    last.addField("Winrate: ", faceitLast20EloPoints.win*100 / savedCounter +"%", true);
                    last.addField("Start / End Elo: ", faceitLast20EloPoints.startElo+" / "+faceitLast20EloPoints.endElo, true);
                    last.addField("Min. / Max. Elo: ", faceitLast20EloPoints.lowelo+" / "+faceitLast20EloPoints.highelo, true);
                    last.setImage("https://quickchart.io/chart?bkg=white&c={type:%27line%27,data:{labels:["+hello.toString()+"],datasets:[{label:%27EloPoints%27,data:%20["+faceitLast20EloPoints.fcEloHistory+"],%20fill:true,backgroundColor:%22rgba(255,0,0,0.5)%22,borderColor:%27red%27}]},options:{scales:{xAxes:[{ticks:{reverse:%20true}}],yAxes:[{ticks:{beginAtZero:%20false}}],}}}");
                    last.setColor(0xe6851e);


                    event.getChannel().sendMessage(last.build()).queue();
                    toSend.delete().queue();
                    faceitOnlyPlayerId.faceitplayerID = null;
                    faceitLast20EloPoints.totalsumkills = 0;
                    faceitLast20EloPoints.totalsumdeaths = 0;
                    faceitLast20EloPoints.totalsumkd = 0;
                    faceitLast20EloPoints.realkd = "0";
                    faceitLast20EloPoints.totalsumassists = 0;
                    faceitLast20EloPoints.totalsummvps = 0;
                    faceitLast20EloPoints.totalsumheadshots = 0;
                    faceitLast20EloPoints.totalsumtriple = 0;
                    faceitLast20EloPoints.totalsumquadro = 0;
                    faceitLast20EloPoints.totalsumace = 0;
                    faceitLast20EloPoints.win = 0;


            }
                else {
                event.getChannel().sendMessage("Wrong 3rd Argument! Use *latest* to see your last game, *last15* to see your last 15 Games or any map like *dust2* to see your map stats").queue();
            }

        }

            }
        }
    }
