import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.io.IOException;

public class DiscordMessage extends ListenerAdapter {

    public static String savedArgs;
    public static String faceitLevelPNG;
    public String countryCodeToEmoji(String code) {
        int OFFSET = 127397;
        if(code == null || code.length() != 2) {
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

    public void onGuildMessageReceived(GuildMessageReceivedEvent event) {
        java.lang.String[] args = event.getMessage().getContentRaw().split("\\s+");

        if (args[0].equalsIgnoreCase(".faceit")) {
            if (args.length < 2) {
                event.getChannel().sendMessage("Dont forget Faceit Name!").queue();
            } else {
                event.getChannel().sendMessage("*loading faceit Stats*").queue();

                savedArgs = args[1];
                try {
                    faceitAPI.main(null);
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                event.getMessage().delete();

                if(faceitAPI.faceitLevel == 1){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_1.png";
                }
                if(faceitAPI.faceitLevel == 2){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_2.png";
                }
                if(faceitAPI.faceitLevel == 3){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_3.png";
                }
                if(faceitAPI.faceitLevel == 4){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_4.png";
                }
                if(faceitAPI.faceitLevel == 5){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_5.png";
                }
                if(faceitAPI.faceitLevel == 6){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_6.png";
                }
                if(faceitAPI.faceitLevel == 7){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_7.png";
                }
                if(faceitAPI.faceitLevel == 8){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_8.png";
                }
                if(faceitAPI.faceitLevel == 9){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_9.png";
                }
                if(faceitAPI.faceitLevel == 10){
                    faceitLevelPNG = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/skill_level_10.png";
                }



                EmbedBuilder info = new EmbedBuilder();
                info.setAuthor("Elo: "+faceitAPI.faceitElo, null, faceitLevelPNG);
                info.setTitle("Stats for "+ savedArgs);
                info.setThumbnail(faceitAPI.faceitAvatar);
                info.addField("Country: ", countryCodeToEmoji(faceitAPI.faceitplayerCountry), true);
                info.addField("Wins: ", faceitStats.faceitWins, true);
                info.addField("Winrate: ", faceitStats.faceitRate+"%", true);
                info.addField("K/D: ", faceitStats.faceitKD, true);
                info.addField("Last 5 Games: ", String.valueOf(faceitStats.faceitRecent).replace("[", "").replaceAll(",", "").replace("]", "").replaceAll("1", "\uD83C\uDFC6").replaceAll("0", "").replaceAll("\"", "") ,true);
                info.setColor(0xe6851e);



                event.getChannel().sendMessage(info.build()).queue();
                //faceitRecent faceitLongest faceitKD faceitRate faceitWins faceitLevel faceitElo tofu





                System.out.println(savedArgs+" stats action");

            }
        }
    }
}

