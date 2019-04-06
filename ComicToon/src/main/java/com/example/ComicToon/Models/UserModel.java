package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class UserModel{
    @Id
    public String id;
    @Field()
    private String username;
    private String password;
    private String userType;
    private boolean verified;
    private String key;
    private boolean active;
    private ArrayList<ComicModel> comics;
    private ArrayList<ComicSeriesModel> comicSeries;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public ArrayList<ComicModel> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicModel> comics) {
        this.comics = comics;
    }

    public ArrayList<ComicSeriesModel> getComicSeries() {
        return this.comicSeries;
    }

    public void setComicSeries(ArrayList<ComicSeriesModel> comicSeries) {
        this.comicSeries = comicSeries;
    }
    //private ArrayList<SubscriptionModel> subscriptions;


    public UserModel(String username, String password, String userType){
        this.username = username;
        this.password = password;
        this.userType = userType;
        this.verified = false;
        this.key = "key";
        this.active = true;
        this.comics = new ArrayList<ComicModel>();
        this.comicSeries = new ArrayList();
        //this.subscriptions = new ArrayList();
    }


    //Class methods
    @Override
    public String toString() {
        return String.format("User[id = %s, username = %s, password = %s]",id,username,password);
    }

    //Getters and Setters
    


}