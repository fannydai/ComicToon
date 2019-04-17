package com.example.ComicToon.Models.RequestResponseModels;

public class ViewComicForm {
    private String comicName;
    private String comicOwnerName;

    public String getComicName() {
        return this.comicName;
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

    public void setComicName(String comicName) {
        this.comicName = comicName;
    }
}