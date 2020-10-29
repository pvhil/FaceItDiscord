import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.TextChannel;
import net.dv8tion.jda.api.events.guild.GuildJoinEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.io.IOException;
import java.util.concurrent.CompletionException;

public class DiscordMessage extends ListenerAdapter implements EventListener {

    public static String savedArgs;
    public static String savedMap;
    public static String faceitLevelPNG;
    public static String mapCode;

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
    public void onGuildJoin(GuildJoinEvent event){
        Guild guild = event.getGuild();
        TextChannel channel = guild.getDefaultChannel();
        EmbedBuilder join = new EmbedBuilder();
        join.setAuthor("Thanks for adding the FaceIT-Stats Bot!");
        join.setColor(0xe6851e);
        join.setFooter("Bot made with love by phil#0346", "https://cdn.discordapp.com/avatars/208226733789282304/80c3394993bb882de40259ee52202c44.webp?size=128");
        join.setDescription("The Bot has following Commands: \n*.faceit <name>* = Shows your alltime FaceIT Stats\n.*faceit <name> latest* = Shows your Stats from your latest game\n*.faceit <name> <map>* = Shows your performance in a specific map\n*.faceit <name> last15* = Shows your Stats for your last 15 Games\nPlease vote for our Bot [Click Here](https://top.gg/bot/770312130037153813/vote)");
        channel.sendMessage(join.build()).queue();
    }

    public void onMessageReceived(MessageReceivedEvent event) {
        java.lang.String[] args = event.getMessage().getContentRaw().split("\\s+");

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
                    event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                    faceitStats.faceitRecent = null;
                    faceitStats.faceitKD = null;
                    faceitStats.faceitWins = null;
                    faceitStats.faceitLongest = null;
                    faceitStats.faceitRate = null;
                    e.printStackTrace();
                }
                event.getMessage().delete();

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
                info.setTitle("Stats for " + savedArgs);
                info.setThumbnail(faceitAPI.faceitAvatar);
                info.addField("Country: ", countryCodeToEmoji(faceitAPI.faceitplayerCountry), true);
                info.addField("Wins: ", faceitStats.faceitWins, true);
                info.addField("Winrate: ", faceitStats.faceitRate + "%", true);
                info.addField("K/D: ", faceitStats.faceitKD, true);
                info.addField("Last 5 Games: ", String.valueOf(faceitStats.faceitRecent).replace("[", "").replaceAll(",", "").replace("]", "").replaceAll("1", "\uD83C\uDFC6").replaceAll("0", "❌").replaceAll("\"", ""), true);
                info.addField("AFK / Left early: ", String.valueOf(faceitAPI.faceitAfk) + " / " + String.valueOf(faceitAPI.faceitLeave), true);
                info.setColor(0xe6851e);


                event.getChannel().sendMessage(info.build()).queue();
                //faceitRecent faceitLongest faceitKD faceitRate faceitWins faceitLevel faceitElo tofu


                System.out.println(savedArgs + " stats action");

            }
            if (args.length == 3) {
                savedArgs = args[1];
                savedMap = args[2];
                if (savedMap.equalsIgnoreCase("latest")) {
                    event.getChannel().sendMessage("*loading latest Match*").queue();
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException | IOException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        e.printStackTrace();
                        event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                    }

                    faceitLatest.main(null);
                    EmbedBuilder latestem = new EmbedBuilder();
                    latestem.setAuthor(faceitLatest.team1 + " vs " + faceitLatest.team2, null);
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


                    latestem.setFooter(faceitLatest.latestGameURL);
                    latestem.setColor(0xe6851e);
                    if (faceitLatest.gameWinner.equals("faction2")) {
                        latestem.setThumbnail("https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/team2w.png");
                    } else {
                        latestem.setThumbnail("https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/team1w.png");
                    }

                    event.getChannel().sendMessage(latestem.build()).queue();
                    faceitLatest.players1 = null;
                    faceitLatest.players2 = null;
                    faceitLatest.latestGameURL = null;
                    faceitLatest.gameWinner = null;
                    faceitLatest.team1 = null;
                    faceitLatest.team2 = null;
                    faceitOnlyPlayerId.faceitplayerID = null;


                } else if (savedMap.equalsIgnoreCase("dust2") || savedMap.equalsIgnoreCase("mirage") || savedMap.equalsIgnoreCase("train") || savedMap.equalsIgnoreCase("cache") || savedMap.equalsIgnoreCase("overpass") || savedMap.equalsIgnoreCase("vertigo") || savedMap.equalsIgnoreCase("inferno") || savedMap.equalsIgnoreCase("nuke")) {
                    event.getChannel().sendMessage("*loading map stats*").queue();
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException | IOException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        e.printStackTrace();
                        event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
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
                    faceitMaps.main(null);
                    EmbedBuilder mapem = new EmbedBuilder();
                    mapem.setAuthor("Stats for " + savedMap);
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
                    faceitOnlyPlayerId.faceitplayerID = null;


                } else if (savedMap.equalsIgnoreCase("last15")||savedMap.equalsIgnoreCase("last")) {
                    event.getChannel().sendMessage("*loading last 15 games (will take some time)*").queue();
                    try {
                        faceitOnlyPlayerId.main(null);
                    } catch (InterruptedException | IOException e) {
                        e.printStackTrace();
                    } catch (CompletionException e) {
                        e.printStackTrace();
                        event.getChannel().sendMessage("Wrong FaceIT Name!").queue();
                    }
                    faceitLast20.main(null);

                    EmbedBuilder last = new EmbedBuilder();
                    last.setAuthor("Stats for your last 15 Games");
                    last.setThumbnail(faceitOnlyPlayerId.faceitAva);
                    last.addField("Average Kills", String.valueOf(faceitLast20.realkills), true);
                    last.addField("Average Death", String.valueOf(faceitLast20.realdeaths), true);
                    last.addField("Average K/D", String.valueOf(faceitLast20.realkd), true);
                    last.addField("Average Assists", String.valueOf(faceitLast20.realassists), true);
                    last.addField("Average MVPs", String.valueOf(faceitLast20.realmvps), true);
                    last.addField("Average Triple Kills", String.valueOf(faceitLast20.totalsumtriple), false);
                    last.addField("Average Quadro Kills", String.valueOf(faceitLast20.totalsumquadro), true);
                    last.addField("Average Aces", String.valueOf(faceitLast20.totalsumace), true);
                    last.addField("Average Headshots", String.valueOf(faceitLast20.realhead), true);
                    last.setColor(0xe6851e);


                    event.getChannel().sendMessage(last.build()).queue();
                    faceitOnlyPlayerId.faceitplayerID = null;
                    faceitLast20.realkills = 0;
                    faceitLast20.realdeaths = 0;
                    faceitLast20.realassists = 0;
                    faceitLast20.realmvps = 0;
                    faceitLast20.realkd = 0;
                    faceitLast20.realtriple = 0;
                    faceitLast20.realquadro = 0;
                    faceitLast20.realace = 0;
                    faceitLast20.realhead = 0;

                    faceitLast20MatchStats.pentaKills = 0;
                    faceitLast20MatchStats.tripleKills = 0;
                    faceitLast20MatchStats.assists = 0;
                    faceitLast20MatchStats.kills = 0;
                    faceitLast20MatchStats.quadroKills = 0;
                    faceitLast20MatchStats.mvps = 0;
                    faceitLast20MatchStats.deaths = 0;
                    faceitLast20MatchStats.kdratio = null;
                    faceitLast20MatchStats.headshots = 0;

                    faceitLast20.totalsumtriple = 0;
                    faceitLast20.totalsumquadro = 0;
                    faceitLast20.totalsumace = 0;

            } else {
                event.getChannel().sendMessage("Wrong 3rd Argument! Use *latest* to see your last game or any map like *dust2* to see your map stats").queue();
            }

        }
            }
        }
    }


