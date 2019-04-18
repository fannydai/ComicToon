package com.example.ComicToon.Models.RequestResponseModels;

public class ViewComicSeriesForm {
    private String comicSeriesName;
    private String OwnerName;
    private String viewerName;

    /**
     * @return the comicSeriesName
     */
    public String getComicSeriesName() {
        return comicSeriesName;
    }

    /**
     * @return the ownerName
     */
    public String getOwnerName() {
        return OwnerName;
    }

    /**
     * @param ownerName the ownerName to set
     */
    public void setOwnerName(String ownerName) {
        this.OwnerName = ownerName;
    }

    /**
     * @param comicSeriesName the comicSeriesName to set
     */
    public void setComicSeriesName(String comicSeriesName) {
        this.comicSeriesName = comicSeriesName;
    }
    
    public String getViewerName() {
        return this.viewerName;
    }

    public void setViewerName(String viewerName) {
        this.viewerName = viewerName;
    }

}