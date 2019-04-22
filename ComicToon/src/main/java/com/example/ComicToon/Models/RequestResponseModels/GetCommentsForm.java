package com.example.ComicToon.Models.RequestResponseModels;

public class GetCommentsForm {
    private String comicOwner;
    private String comicName;

    public String getComicOwner() {
        return this.comicOwner;
    }

    public void setComicOwner(String comicOwner) {
        this.comicOwner = comicOwner;
    }

    public String getComicName() {
        return this.comicName;
    }

    public void setComicName(String comicName) {
        this.comicName = comicName;
    }
}