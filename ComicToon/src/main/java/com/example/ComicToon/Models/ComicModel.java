package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class ComicModel{
    @Id
    public String id;
    @Field()
    private String name;
    private String userID;
    private String comicSeriesID;
    private ArrayList<PanelModel> panelsList;
    private ArrayList <CommentModel> commentsList;
    private String Date;
    private ArrayList<RatingModel> RatingsID;

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

    public String getComicSeriesID() {
        return this.comicSeriesID;
    }

    public void setComicSeriesID(String comicSeriesID) {
        this.comicSeriesID = comicSeriesID;
    }

    public ArrayList<PanelModel> getPanelsList() {
        return this.panelsList;
    }

    public void setPanelsList(ArrayList<PanelModel> panelsList) {
        this.panelsList = panelsList;
    }

    public ArrayList<CommentModel> getCommentsList() {
        return this.commentsList;
    }

    public void setCommentsList(ArrayList<CommentModel> commentsList) {
        this.commentsList = commentsList;
    }

    public String getDate() {
        return this.Date;
    }

    public void setDate(String Date) {
        this.Date = Date;
    }

    public ArrayList<RatingModel> getRatingsID() {
        return this.RatingsID;
    }

    public void setRatingsID(ArrayList<RatingModel> RatingsID) {
        this.RatingsID = RatingsID;
    }


    public ComicModel(String name, String userID, String comicSeriesID, String Date){
        this.name = name;
        this.userID = userID;
        this.comicSeriesID = comicSeriesID;
        this.Date = Date;
        this.panelsList = new ArrayList<PanelModel>();
        this.commentsList = new ArrayList<CommentModel>();
        this.RatingsID = new ArrayList<RatingModel>();
    }

    

}