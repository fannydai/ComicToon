package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.Locale;
import java.text.SimpleDateFormat;

public class ComicModel{
    @Id
    public String id;
    @Field()
    private String name;
    private String description;
    private String userID;
    private String username;
    private String comicSeriesID;
    private ArrayList<String> panelsList;
    private ArrayList <String> commentsList;
    private String Date;
    private ArrayList<String> RatingsID;
    //shared with userIDs
    private ArrayList<String> sharedWith;


    public ComicModel(String name, String description, String userID, String username, String comicSeriesID, String Date, ArrayList<String> sharedWith){
        this.name = name;
        this.description = description;
        this.userID = userID;
        this.username = username;
        this.comicSeriesID = comicSeriesID;
        this.Date = Date;
        this.panelsList = new ArrayList<String>();
        this.commentsList = new ArrayList<String>();
        this.RatingsID = new ArrayList<String>();
        this.sharedWith = sharedWith;

    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<String> getSharedWith() {
        return this.sharedWith;
    }

    public void setSharedWith(ArrayList<String> sharedWith) {
        this.sharedWith = sharedWith;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserID() {
        return this.userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComicSeriesID() {
        return this.comicSeriesID;
    }

    public void setComicSeriesID(String comicSeriesID) {
        this.comicSeriesID = comicSeriesID;
    }

    public ArrayList<String> getPanelsList() {
        return this.panelsList;
    }

    public void setPanelsList(ArrayList<String> panelsList) {
        this.panelsList = panelsList;
    }

    public ArrayList<String> getCommentsList() {
        return this.commentsList;
    }

    public void setCommentsList(ArrayList<String> commentsList) {
        this.commentsList = commentsList;
    }

    public String getDate() {
        return this.Date;
    }

    public void setDate(String Date) {
        this.Date = Date;
    }

    public ArrayList<String> getRatingsID() {
        return this.RatingsID;
    }

    public void setRatingsID(ArrayList<String> RatingsID) {
        this.RatingsID = RatingsID;
    }

    private final static String dateFormat = "EEE MMM dd HH:mm:ss yyyy";
    private final static Comparator<String> dateComp = new Comparator<String>() {
        public int compare(String s1, String s2) {
            Date d1 = null;
            Date d2 = null;
            try {
                d1 = new SimpleDateFormat( dateFormat,Locale.ENGLISH ).parse(s1);
                d2 = new SimpleDateFormat( dateFormat,Locale.ENGLISH ).parse(s2);
            } catch (ParseException e) {
                //HANDLE THIS EXCEPTION
            }
            return -1 * d1.compareTo(d2);
        }
    };
}