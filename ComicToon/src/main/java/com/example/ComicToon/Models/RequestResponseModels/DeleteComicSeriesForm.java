package com.example.ComicToon.Models.RequestResponseModels;

public class DeleteComicSeriesForm {
    private String seriesName;
    private String ownerName;

    public String getSeriesName() {
        return this.seriesName;
    }

    public void setSeriesName(String seriesName) {
        this.seriesName = seriesName;
    }

    public String getOwnerName() {
        return this.ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

}