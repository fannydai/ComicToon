package com.example.ComicToon.Models.RequestResponseModels;


public class ForgotResult {
    private String result;
    private String key;

    public String getResult(){
        return this.result;
    }

    public void setResult(String result){
        this.result = result;
    }

    /**
     * @return the key
     */
    public String getKey() {
        return key;
    }

    /**
     * @param key the key to set
     */
    public void setKey(String key) {
        this.key = key;
    }
}