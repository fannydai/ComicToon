package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class CreateComicSeriesForm {
    private String username;
    private String name;
    private ArrayList<String> genre;
    private String privacy;

    public String getUsername() {
        return this.username;
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