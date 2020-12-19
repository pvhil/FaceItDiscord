import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import org.jetbrains.annotations.NotNull;

import javax.security.auth.login.LoginException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class main implements EventListener {
    public static JDA jda;
    public static String FACEITTOKEN = System.getenv("FACEITTOKEN");
    public static String BOTTOKEN = System.getenv("BOTTOKEN");
    public static Connection conn;
    public static String fullURL;


    public static void main(String[] args) throws LoginException {
        //bot is finished

        jda = JDABuilder.createDefault(BOTTOKEN)
                .addEventListeners(new DiscordMessage())
                .build();
        main.jda.getPresence().setActivity(Activity.watching("loading... | .faceithelp"));

        try {
            URI dbUri = new URI(System.getenv("DATABASE_URL"));

            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
            fullURL = dbUrl + "?user=" + username + "&password=" + password + "&sslmode=require";


            conn = DriverManager.getConnection(dbUrl + "?user=" + username + "&password=" + password + "&sslmode=require");
            System.out.println("Connected to sql");
        } catch (SQLException | URISyntaxException throwables) {
            throwables.printStackTrace();
            System.out.println("ERROR IN SQL. Voting will not work.");
        }
        main.jda.getPresence().setActivity(Activity.watching("your stats | .faceithelp"));
    }
    @Override
    public void onEvent(@NotNull GenericEvent genericEvent) {

    }
}

