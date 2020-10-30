import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import org.jetbrains.annotations.NotNull;

import javax.security.auth.login.LoginException;

public class main implements EventListener {
    public static JDA jda;
    public static String FACEITTOKEN = System.getenv("FACEITTOKEN");
    public static String BOTTOKEN = System.getenv("BOTTOKEN");
    public static String FACEITLASTTOKEN = System.getenv("LASTTOKEN");



    public static void main(String[] args) throws LoginException {
        
        jda = JDABuilder.createDefault(BOTTOKEN)
                .addEventListeners(new DiscordMessage())
                .build();
    }
    @Override
    public void onEvent(@NotNull GenericEvent genericEvent) {

    }
}

