package com.example.ComicToon.Models.RequestResponseModels;

public class SubscriptionForm{
    private String username;
    private String seriesid;

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @return the seriesid
     */
    public String getSeriesid() {
        return seriesid;
    }

    /**
     * @param seriesid the seriesid to set
     */
    public void setSeriesid(String seriesid) {
        this.seriesid = seriesid;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

}