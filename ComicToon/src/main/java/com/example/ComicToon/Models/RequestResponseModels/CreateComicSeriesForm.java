package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class CreateComicSeriesForm {
    private String username;
    private String name;
    private String description;
    private ArrayList<String> genre;
    private String privacy;

    public String getUsername() {
        return this.username;
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

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName(){
        return this.name;
    }

    public void setName (String name){
        this.name = name;
    }
    public ArrayList<String> getGenre(){
        return this.genre;
    }

    public void setGenre (ArrayList<String> genre){
        this.genre = genre;
    }
    public String getPrivacy(){
        return this.privacy;
    }
    public void setPrivacy(String privacy){
        this.privacy = privacy;
    }
}