package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class ComicSeriesModel{
    @Id
    public String id;
    @Field()
    private String name;
    private String userID;
    private ArrayList<ComicModel> comics;
    private ArrayList<String> genre;
    private String privacy;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserID() {
        return this.userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public ArrayList<ComicModel> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicModel> comics) {
        this.comics = comics;
    }

    public String getPrivacy() {
        return this.privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public ComicSeriesModel(String name, String userID, String privacy, String[] genres) {
        this.name = name;
        this.setUserID(userID);
        this.setPrivacy(privacy);
        this.setComics(new ArrayList<ComicModel>());
        this.genre = new ArrayList<String>();
        for(String gen: genres){
            genre.add(gen);
        }
    }

    
}