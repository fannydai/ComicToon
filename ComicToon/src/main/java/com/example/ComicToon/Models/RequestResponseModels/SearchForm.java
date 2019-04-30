package com.example.ComicToon.Models.RequestResponseModels;

public class SearchForm{
    private String username;
    private String token;
    private String query; //can search by username, seriesname, or comic name

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getQuery() {
        return this.query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}