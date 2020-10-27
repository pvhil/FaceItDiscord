import net.dv8tion.jda.api.AccountType;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;

import javax.security.auth.login.LoginException;

public class main {
    public static JDA jda;
    public static String FACEITTOKEN = System.getenv("FACEITTOKEN");
    public static String BOTTOKEN = "NzcwMzEyMTMwMDM3MTUzODEz.X5bvEw.m4Ukp5gG2VhMskWfKi9zUwzbAFk";


    public static void main(String[] args) throws LoginException {

        jda = new JDABuilder(AccountType.BOT)
                .setToken(BOTTOKEN)
                .build();
        jda.addEventListener(new DiscordMessage());


    }

}

