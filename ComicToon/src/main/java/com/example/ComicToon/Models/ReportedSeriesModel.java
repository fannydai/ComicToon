package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class ReportedSeriesModel {
    @Id
    public String id;
    @Field()
    private String seriesID; //series to be reported
    private String userID; //person who's reporting
    private String username; //person who's reporting
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

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    public ReportedSeriesModel(String seriesID, String userID, String username, String reason) {
        this.seriesID = seriesID;
        this.userID = userID;
        this.username = username;
        this.reason = reason;
    }

    /**
     * @return the seriesID
     */
    public String getSeriesID() {
        return seriesID;
    }

    /**
     * @param seriesID the seriesID to set
     */
    public void setSeriesID(String seriesID) {
        this.seriesID = seriesID;
    }
}