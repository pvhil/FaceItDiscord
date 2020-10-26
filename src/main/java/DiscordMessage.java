
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.awt.*;
import java.io.IOException;

public class DiscordMessage extends ListenerAdapter implements EventListener {

    public static String savedArgs;
    String newLine = System.getProperty("line.separator");
    public static Image faceitLevelPNG;

    public void onMessageReceived(MessageReceivedEvent event) {
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


                EmbedBuilder info = new EmbedBuilder();
                info.setAuthor(faceitAPI.faceitElo+ " ");
                info.setTitle("Stats for "+ savedArgs);
                info.setThumbnail(faceitAPI.faceitAvatar);
                info.addField("Country:   ", faceitAPI.faceitplayerCountry, true);
                info.addField("Wins: ", faceitStats.faceitWins, true);
                info.addField("Winrate: ", faceitStats.faceitRate+"%", true);
                info.addField("K/D: ", faceitStats.faceitKD, true);
                info.addField("Last 5 Games: ", String.valueOf(faceitStats.faceitRecent), true);
                info.setColor(0xe6851e);



                event.getChannel().sendMessage(info.build()).queue();
                //faceitRecent faceitLongest faceitKD faceitRate faceitWins faceitLevel faceitElo



                System.out.println(savedArgs+" stats action");

            }
        }
    }
}

