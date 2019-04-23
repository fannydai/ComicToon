package com.example.ComicToon.Models.RequestResponseModels;

public class CommentForm {
    private String comicOwner;
    private String comicName;
    private String commenterName;
    private String content;

    public String getComicOwner() {
        return this.comicOwner;
    }

    public void setComicOwner(String comicOwner) {
        this.comicOwner = comicOwner;
    }

    public String getComicName() {
        return this.comicName;
    }

    public void setComicName(String comicName) {
        this.comicName = comicName;
    }

    public String getCommenterName() {
        return this.commenterName;
    }

    public void setCommenterName(String commenterName) {
        this.commenterName = commenterName;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
