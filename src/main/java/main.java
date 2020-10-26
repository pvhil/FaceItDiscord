import net.dv8tion.jda.api.AccountType;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import org.jetbrains.annotations.NotNull;

import javax.security.auth.login.LoginException;

public class main implements EventListener {
    public static JDA jda;
    public static String faceitToken;


    public static void main(String[] args) throws LoginException {
        jda = new JDABuilder(AccountType.BOT)
                .setToken(BOTTOKEN)
                .build();
        jda.addEventListener(new DiscordMessage());


    }

    @Override
    public void onEvent(@NotNull GenericEvent genericEvent) {

    }
}

