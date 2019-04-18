package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

public class UpdatePanelForm {
    private String id;
    private String image;
    private String canvas;

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

    public String getCanvas() {
        return this.canvas;
    }

    public void setCanvas(String canvas) {
        this.canvas = canvas;
    }
}