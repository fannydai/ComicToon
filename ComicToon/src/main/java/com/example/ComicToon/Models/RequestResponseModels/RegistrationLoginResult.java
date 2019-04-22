package com.example.ComicToon.Models.RequestResponseModels;

public class RegistrationLoginResult{
    private String status;
    private String username;
    private String id;

    public String getstatus() {
        return status;
    }
    public String getusername() {
        return username;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }
}