package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class ReportedComicsModel {
    @Id
    public String id;
    @Field()
    private String comicID; //comic reported
    private String userID; //person who reported it
    private String reason;

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the userID
     */
    public String getUserID() {
        return userID;
    }

    /**
     * @param userID the userID to set
     */
    public void setUserID(String userID) {
        this.userID = userID;
    }

    /**
     * @return the reason
     */
    public String getReason() {
        return reason;
    }

    /**
     * @param reason the reason to set
     */
    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportedComicsModel(String comicID, String userID, String reason){
        this.comicID = comicID;
        this.userID = userID;
        this.reason = reason;
    }

    /**
     * @return the comicID
     */
    public String getComicID() {
        return comicID;
    }

    /**
     * @param comicID the comicID to set
     */
    public void setComicID(String comicID) {
        this.comicID = comicID;
    }
}