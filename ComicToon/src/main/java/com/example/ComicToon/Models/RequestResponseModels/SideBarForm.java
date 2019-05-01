package com.example.ComicToon.Models.RequestResponseModels;

public class SideBarForm {
    private String token;
    private String viewerName;
    private String viewedComicID;

    public String getToken() {
        return this.token;
    }

    /**
     * @return the viewedComicID
     */
    public String getViewedComicID() {
        return viewedComicID;
    }

    /**
     * @param viewedComicID the viewedComicID to set
     */
    public void setViewedComicID(String viewedComicID) {
        this.viewedComicID = viewedComicID;
    }

    /**
     * @return the viewerName
     */
    public String getViewerName() {
        return viewerName;
    }

    /**
     * @param viewerName the viewerName to set
     */
    public void setViewerName(String viewerName) {
        this.viewerName = viewerName;
    }

    public void setToken(String token) {
        this.token = token;
    }

}