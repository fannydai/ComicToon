package com.example.ComicToon.Models.RequestResponseModels;

public class DeleteComicForm {
    private String comicName;
    private String ownerName;

    public String getComicName() {
        return this.comicName;
    }

    public void setSeriesName(String comicName) {
        this.comicName = comicName;
    }

    public String getOwnerName() {
        return this.ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

}