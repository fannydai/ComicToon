package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class UpdateComicForm {
    private String username;
    private String description;
    private String oldName;
    private String name;
    private String oldSeries;
    private String series;
    private String privacy;
    private ArrayList<String> sharedWith;
    private ArrayList<String> canvases;
    private ArrayList<String> images;
    private Boolean flag;

    public String getUsername() {
        return this.username;
    }

    /**
     * @return the flag
     */
    public boolean getFlag() {
        return flag;
    }

    /**
     * @param flag the flag to set
     */
    public void setFlag(Boolean flag) {
        this.flag = flag;
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

    public String getOldName() {
        return this.oldName;
    }

    public void setOldName() {
        this.oldName = oldName;
    }

    public String getName(){
        return this.name;
    }
    public void SetName(String name){
        this.name = name;
    }

    public String getOldSeries() {
        return this.oldSeries;
    }

    public void setOldSeries(String oldSeries) {
        this.oldSeries = oldSeries;
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

    public ArrayList<String> getCanvases() {
        return this.canvases;
    }

    public void setCanvases(ArrayList<String> canvases) {
        this.canvases = canvases;
    }

    public ArrayList<String> getImages() {
        return this.images;
    }

    public void setImages(ArrayList<String> images) {
        this.images = images;
    }
}