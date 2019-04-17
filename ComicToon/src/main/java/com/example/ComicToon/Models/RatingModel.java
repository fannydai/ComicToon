package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class RatingModel{
    @Id
    public String id;
    @Field()
    private String userID;
    private int Rating;
    private String comicID;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserID() {
        return this.userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public int getRating() {
        return this.Rating;
    }

    public void setRating(int Rating) {
        this.Rating = Rating;
    }

    public String getComicID() {
        return this.comicID;
    }

    public void setComicID(String comicID) {
        this.comicID = comicID;
    }

    public RatingModel(String userID, int Rating, String ComicID){
        this.userID = userID;
        this.Rating = Rating;
        this.comicID = ComicID;
    }
}