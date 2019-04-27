package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;
import java.util.HashMap;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ComicSeriesModel;
import com.example.ComicToon.Models.CommentModel;
import com.example.ComicToon.Models.UserModel;

public class AdminDataResult {
   private HashMap<String, Integer> users = new HashMap<>(); //id of users and # of times they've been reported
   private HashMap<String, Integer> comics = new HashMap<>(); //id of comics and # of times they've been reported
   private HashMap<String, Integer> series = new HashMap<>(); //id of series and # of times they've been reported
   private HashMap<String, Integer> comments = new HashMap<>(); //id of comments and # of times they've been reported
   private ArrayList<UserModel> userContent = new ArrayList<>();
   private ArrayList<ComicModel> comicConent = new ArrayList<>();
   private ArrayList<ComicSeriesModel> seriesContent = new ArrayList<>();
   private ArrayList<CommentModel> commentContent = new ArrayList<>();
   private ArrayList<String> seriesOwners = new ArrayList<>();

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

    /**
     * @return the userContent
     */
    public ArrayList<UserModel> getUserContent() {
        return userContent;
    }

    /**
     * @param userContent the userContent to set
     */
    public void setUserContent(ArrayList<UserModel> userContent) {
        this.userContent = userContent;
    }

    /**
     * @return the comicConent
     */
    public ArrayList<ComicModel> getComicConent() {
        return comicConent;
    }

    /**
     * @param comicConent the comicConent to set
     */
    public void setComicConent(ArrayList<ComicModel> comicConent) {
        this.comicConent = comicConent;
    }

    /**
     * @return the seriesContent
     */
    public ArrayList<ComicSeriesModel> getSeriesContent() {
        return seriesContent;
    }

    /**
     * @param seriesContent the seriesContent to set
     */
    public void setSeriesContent(ArrayList<ComicSeriesModel> seriesContent) {
        this.seriesContent = seriesContent;
    }

    /**
     * @return the commentContent
     */
    public ArrayList<CommentModel> getCommentContent() {
        return commentContent;
    }

    /**
     * @param commentContent the commentContent to set
     */
    public void setCommentContent(ArrayList<CommentModel> commentContent) {
        this.commentContent = commentContent;
    }

    /**
     * @return the seriesOwners
     */
    public ArrayList<String> getSeriesOwners() {
        return seriesOwners;
    }

    /**
     * @param seriesOwners the seriesOwners to set
     */
    public void setSeriesOwners(ArrayList<String> seriesOwners) {
        this.seriesOwners = seriesOwners;
    }
}