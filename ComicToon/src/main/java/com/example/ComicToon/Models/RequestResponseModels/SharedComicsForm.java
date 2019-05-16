package com.example.ComicToon.Models.RequestResponseModels;

public class SharedComicsForm {
    private String token;
    private String comicOwnerName;

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    /**
     * @return the comicOwnerName
     */
    public String getComicOwnerName() {
        return comicOwnerName;
    }

    /**
     * @param comicOwnerName the comicOwnerName to set
     */
    public void setComicOwnerName(String comicOwnerName) {
        this.comicOwnerName = comicOwnerName;
    }
}