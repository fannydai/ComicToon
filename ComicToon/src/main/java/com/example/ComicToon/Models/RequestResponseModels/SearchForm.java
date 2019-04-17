package com.example.ComicToon.Models.RequestResponseModels;

public class SearchForm{
    private String query; //can search by username, seriesname, or comic name

    public String getQuery() {
        return this.query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}