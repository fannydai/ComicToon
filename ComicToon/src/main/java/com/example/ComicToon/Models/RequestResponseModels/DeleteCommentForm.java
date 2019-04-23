package com.example.ComicToon.Models.RequestResponseModels;

public class DeleteCommentForm {
    private String commentID;
    private String comicID;

    public String getCommentID() {
        return this.commentID;
    }

    public void setCommentId(String commentID) {
        this.commentID = commentID;
    }

    public String getComicID() {
        return this.comicID;
    }

    public void setComicID(String comicID) {
        this.comicID = comicID;
    }
}