package com.example.ComicToon.Models.RequestResponseModels;

public class RegistrationLoginResult{
    private String status;
    private String username;

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
}