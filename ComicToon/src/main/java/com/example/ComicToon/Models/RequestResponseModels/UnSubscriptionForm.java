package com.example.ComicToon.Models.RequestResponseModels;

public class UnSubscriptionForm{
    private String username;
    private String unSub;

    /**
     * @return the username
     */
    public String getUsername() {
        return this.username;
    }

    /**
     * @return the sub
     */
    public String getUnSub() {
        return this.unSub;
    }

    /**
     * @param sub the sub to set
     */
    public void setUnSub(String unSub) {
        this.unSub = unSub;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }
}