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
    private String description;
    private ArrayList<String> comics;
    private ArrayList<String> genre;
    private ArrayList<String> sharedWith;
    private String privacy;

    public ArrayList<String> getGenre() {
        return this.genre;
    }

    public void setGenre(ArrayList<String> genre) {
        this.genre = genre;
    }

    public String getId() {
        return this.id;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public String getName2(){
        return this.name.toLowerCase();
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

    public ArrayList<String> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<String> comics) {
        this.comics = comics;
    }

    public ArrayList<String> getSharedWith() {
        return this.sharedWith;
    }

    public void setSharedWith(ArrayList<String> sharedWith) {
        this.sharedWith = sharedWith;
    }

    public String getPrivacy() {
        return this.privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }


    public ComicSeriesModel(String name, String description, String userID, String privacy, ArrayList<String> genre) {
        this.name = name;
        this.setUserID(userID);
        this.setPrivacy(privacy);
        this.setDescription(description);
        this.setComics(new ArrayList<String>());
        this.genre = new ArrayList<String>();
        for(String gen: genre){
            this.genre.add(gen);
        }
        this.setSharedWith(new ArrayList<String>());
    }

    
}