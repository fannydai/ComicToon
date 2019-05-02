package com.example.ComicToon.Models.RequestResponseModels;

public class RateComicForm{
    private String username;
    private String comicID;
    private String token;
    //1 or -1
    private int rating;

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComicID() {
        return this.comicID;
    }

    public void setComicID(String comicID) {
        this.comicID = comicID;
    }

    public int getRating() {
        return this.rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token the token to set
     */
    public void setToken(String token) {
        this.token = token;
    }
}