package com.example.ComicToon.Models.RequestResponseModels;

public class AdminDataForm {
    private String token;
    private String username;

    public String getToken() {
        return this.token;
    }

    public void setKey(String token) {
        this.token = token;
    }

    public String getUsername(){
        return this.username;
    }

    public void setUsername(String username){
        this.username = username;
    }
}
