package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;


public class CommentModel{
    @Id
    public String id;
    @Field()
    private String userID;
    private String username;
    private String content;
    private String comicID;
    private String Date;

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

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getComicID() {
        return this.comicID;
    }

    public void setComicID(String comicID) {
        this.comicID = comicID;
    }

    public String getDate() {
        return this.Date;
    }

    public void setDate(String Date) {
        this.Date = Date;
    }

    public CommentModel(String userID, String username, String content, String Date){
        this.userID = userID;
        this.username = username;
        this.content = content;
        this.Date = Date;
    }
}