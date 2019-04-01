package main.java.com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import org.springframework.security.crypto.bcrypt.BCrypt;
/**
 * The User class is the User model stored into mongodb
 */

//todo -- password hashing, currently password is stored in plain text on the database

public class UserModel {
    @Id
    public String id;
    @Field()
    private String username;
    private String password;
    private ArrayList<String> gamesId;

    public UserModel(String username, String password) {
        this.username = username;
        this.password = password;
        //this.setPassword(password);
        this.gamesId = new ArrayList<String>();
    }

    @Override
    public String toString() {
        return String.format("User[id = %s, username = %s, password = %s]",id,username,password);
    }

    // public boolean checkPassword(String password) {
    //     if (BCrypt.checkpw(password, this.password))
    //         return true;
    //     else
    //         return false;
    // }

    public String getUsername() {
        return this.username;
    }
    public void setPassword(String password) {
        //this.password = BCrypt.hashpw(password, BCrypt.gensalt());
        this.password = password;
    }
    public String getPassword() {
        return this.password;
    }
    
    public ArrayList<String> getGamesList() {
        return this.gamesId;
    }
    public void emptyGamesList() {
        this.gamesId = new ArrayList<String>();
    }
    public void setGamesList(ArrayList<String> newGamesList) {
        this.gamesId = newGamesList;
    }
}
