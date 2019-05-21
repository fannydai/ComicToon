package com.example.ComicToon.Models.RequestResponseModels;

public class ViewComicForm {
    private String comicName;
    private String seriesName;
    private String comicOwnerName;
    private String viewerName;

    public String getComicName() {
        return this.comicName;
    }

    /**
     * @return the comicOwnerName
     */
    public String getComicOwnerName() {
        return comicOwnerName;
    }

    /**
     * @param comicOwnerName the comicOwnerName to set
     */
    public void setComicOwnerName(String comicOwnerName) {
        this.comicOwnerName = comicOwnerName;
    }

    public void setComicName(String comicName) {
        this.comicName = comicName;
    }

    public String getSeriesName() {
        return this.seriesName;
    }

    public void setSeriesName(String seriesName) {
        this.seriesName = seriesName;
    }

    public String getViewerName() {
        return this.viewerName;
    }

    public void setViewerName(String viewerName) {
        this.viewerName = viewerName;
    }
}