package com.example.ComicToon.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class PanelModel{
    @Id
    public String id;
    @Field()
    private String image;
    private String canvas;
    private String comicID;

    public String getId() {
        return this.id;
    }

    /**
     * @return the canvas
     */
    public String getCanvas() {
        return canvas;
    }

    /**
     * @param canvas the canvas to set
     */
    public void setCanvas(String canvas) {
        this.canvas = canvas;
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

    public PanelModel(String image, String canvas, String comicID){
        this.image = image;
        this.canvas = canvas;
        this.comicID = comicID;
    }


}