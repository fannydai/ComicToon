package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class UserModel{
    @Id
    public String id;
    @Field()
    private String email;
    private String username;
    private String password;
    private String userType;
    private boolean verified;
    private String key;
    private boolean active;
    private ArrayList<String> comics;
    private ArrayList<String> comicSeries;
    private ArrayList<String> subscriptions;
    private boolean isAdmin;

    public String getId() {
        return this.id;
    }

    /**
     * @return the subscriptions
     */
    public ArrayList<String> getSubscriptions() {
        return subscriptions;
    }

    /**
     * @param subscriptions the subscriptions to set
     */
    public void setSubscriptions(ArrayList<String> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail(){
        return this.email;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return this.userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public boolean isVerified() {
        return this.verified;
    }

    public boolean getVerified() {
        return this.verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getKey() {
        return this.key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isActive() {
        return this.active;
    }

    public boolean getActive() {
        return this.active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public ArrayList<String> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<String> comics) {
        this.comics = comics;
    }

    public ArrayList<String> getComicSeries() {
        return this.comicSeries;
    }

    public void setComicSeries(ArrayList<String> comicSeries) {
        this.comicSeries = comicSeries;
    }
    //private ArrayList<SubscriptionModel> subscriptions;


    public UserModel(String email,String username, String password, String userType){
        this.email = email;
        this.username = username;
        this.password = password;
        this.userType = userType;
        this.verified = false;
        this.key = "key";
        this.active = true;
        this.isAdmin = false;
        this.comics = new ArrayList<String>();
        this.comicSeries = new ArrayList<String>();
        this.subscriptions = new ArrayList<String>();
    }

    //Class methods
    @Override
    public String toString() {
        return String.format("User[id = %s, username = %s, password = %s]",id,username,password);
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the isAdmin
     */
    public boolean isAdmin() {
        return isAdmin;
    }

    /**
     * @param isAdmin the isAdmin to set
     */
    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    //Getters and Setters
    


}