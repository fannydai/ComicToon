package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class UpdateSeriesForm{

    private String seriesID;
    private String new_Name;
    private String new_Description;
    private ArrayList<String> new_Genres;
    private String new_Privacy;


    public String getSeriesID() {
        return this.seriesID;
    }

    public void setSeriesID(String seriesID) {
        this.seriesID = seriesID;
    }

    public String getNew_Name() {
        return this.new_Name;
    }

    public void setNew_Name(String new_Name) {
        this.new_Name = new_Name;
    }

    public String getNew_Description() {
        return this.new_Description;
    }

    public void setNew_Description(String new_Description) {
        this.new_Description = new_Description;
    }

    public ArrayList<String> getNew_Genres() {
        return this.new_Genres;
    }

    public void setNew_Genres(ArrayList<String> new_Genres) {
        this.new_Genres = new_Genres;
    }

    public String getNew_Privacy() {
        return this.new_Privacy;
    }

    public void setNew_Privacy(String new_Privacy) {
        this.new_Privacy = new_Privacy;
    }

    

   


}