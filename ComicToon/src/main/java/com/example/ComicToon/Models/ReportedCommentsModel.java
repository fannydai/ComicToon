package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class ReportedCommentsModel {
    @Id
    public String id;
    @Field()
    private String commentID; //comment to be reported
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

    public ReportedCommentsModel(String commentID, String userID, String reason) {
        this.commentID = commentID;
        this.userID = userID;
        this.reason = reason;
    }

    /**
     * @return the commentID
     */
    public String getCommentID() {
        return commentID;
    }

    /**
     * @param commentID the commentID to set
     */
    public void setCommentID(String commentID) {
        this.commentID = commentID;
    }
}