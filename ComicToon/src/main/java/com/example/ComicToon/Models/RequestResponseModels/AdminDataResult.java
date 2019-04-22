package com.example.ComicToon.Models.RequestResponseModels;

import java.util.HashMap;

public class AdminDataResult {
   private HashMap<String, Integer> users = new HashMap<>(); //id of users and # of times they've been reported
   private HashMap<String, Integer> comics = new HashMap<>(); //id of comics and # of times they've been reported
   private HashMap<String, Integer> series = new HashMap<>(); //id of series and # of times they've been reported
   private HashMap<String, Integer> comments = new HashMap<>(); //id of comments and # of times they've been reported

    /**
     * @return the users
     */
    public HashMap<String, Integer> getUsers() {
        return users;
    }

    /**
     * @param users the users to set
     */
    public void setUsers(HashMap<String, Integer> users) {
        this.users = users;
    }

    /**
     * @return the comics
     */
    public HashMap<String, Integer> getComics() {
        return comics;
    }

    /**
     * @param comics the comics to set
     */
    public void setComics(HashMap<String, Integer> comics) {
        this.comics = comics;
    }

    /**
     * @return the series
     */
    public HashMap<String, Integer> getSeries() {
        return series;
    }

    /**
     * @param series the series to set
     */
    public void setSeries(HashMap<String, Integer> series) {
        this.series = series;
    }

    /**
     * @return the comments
     */
    public HashMap<String, Integer> getComments() {
        return comments;
    }

    /**
     * @param comments the comments to set
     */
    public void setComments(HashMap<String, Integer> comments) {
        this.comments = comments;
    }
}