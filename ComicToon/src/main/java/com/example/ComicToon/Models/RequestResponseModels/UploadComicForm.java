package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class UploadComicForm {
    private String username;
    private String description;
    private String name;
    private String series;
    private String privacy;
    private String canvas;
    private String image;
    private ArrayList<String> sharedWith;

    public String getUsername() {
        return this.username;
    }

    /**
     * @return the sharedWith
     */
    public ArrayList<String> getSharedWith() {
        return sharedWith;
    }

    /**
     * @param sharedWith the sharedWith to set
     */
    public void setSharedWith(ArrayList<String> sharedWith) {
        this.sharedWith = sharedWith;
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
    public void setName(String name){
        this.name = name;
    }
    public String getSeries(){
        return this.series;
    }
    public void setSeries(String series){
        this.series = series;
    }

    public String getPrivacy() {
        return this.privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public String getCanvas() {
        return this.canvas;
    }

    public void setCanvas(String canvas) {
        this.canvas = canvas;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

}