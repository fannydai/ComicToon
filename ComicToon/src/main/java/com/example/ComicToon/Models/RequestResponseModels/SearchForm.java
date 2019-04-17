package com.example.ComicToon.Models.RequestResponseModels;

public class SearchForm{
    private String userName; //can search by any of these 4
    private String seriesName;
    private String comicName;

    public String getUsername() {
        return this.userName;
    }

    public void setUsername(String username) {
        this.userName = username;
    }

    public String getSeriesName() {
        return this.seriesName;
    }

    public void setSeriesName(String seriesName) {
        this.seriesName = seriesName;
    }

    public String getComicName() {
        return this.comicName;
    }

    public void setComicName(String comicName) {
        this.comicName = comicName;
    }
}