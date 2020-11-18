import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import org.jetbrains.annotations.NotNull;

import javax.security.auth.login.LoginException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class main implements EventListener {
    public static JDA jda;
    public static String FACEITTOKEN = System.getenv("FACEITTOKEN");
    public static String BOTTOKEN = System.getenv("BOTTOKEN");
    public static Connection conn;


    public static void main(String[] args) throws LoginException {
        
        jda = JDABuilder.createDefault(BOTTOKEN)
                .addEventListeners(new DiscordMessage())
                .build();
        main.jda.getPresence().setActivity(Activity.watching("your stats | .faceithelp"));

        try {
            conn = DriverManager.getConnection("hidden");
            System.out.println("Connected to sql");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            System.out.println("ERROR IN SQL. Voting will not work.");
        }
    }
    @Override
    public void onEvent(@NotNull GenericEvent genericEvent) {

    }
}

