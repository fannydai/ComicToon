package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class ReportedUsersModel {
    @Id
    public String id;
    @Field()
    private String userID; //person who's reporting
    private String reportedUserID; //person getting reported
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

    public ReportedUsersModel(String userID, String reportedUserID, String reason) {
        this.userID = userID;
        this.reportedUserID= reportedUserID;
        this.reason = reason;
    }

    /**
     * @return the reportedUserID
     */
    public String getReportedUserID() {
        return reportedUserID;
    }

    /**
     * @param reportedUserID the reportedUserID to set
     */
    public void setReportedUserID(String reportedUserID) {
        this.reportedUserID = reportedUserID;
    }
}