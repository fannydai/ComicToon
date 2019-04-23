package com.example.ComicToon.Models.RequestResponseModels;

public class VerifyAccountForm {
    private String email;
    private String key;

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getKey() {
        return this.key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}