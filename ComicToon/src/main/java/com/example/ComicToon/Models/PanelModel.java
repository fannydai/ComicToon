package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class PanelModel{
    @Id
    public String id;
    @Field()
    private String image;
    private String comicID;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getComicID() {
        return this.comicID;
    }

    public void setComicID(String comicID) {
        this.comicID = comicID;
    }

    public PanelModel(String image, String comicID){
        this.image = image;
        this.comicID = comicID;
    }


}