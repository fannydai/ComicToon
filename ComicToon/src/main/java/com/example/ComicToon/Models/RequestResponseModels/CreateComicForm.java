package com.example.ComicToon.Models.RequestResponseModels;

public class CreateComicForm {
    private String username;
    private String name;
    private String series;
    private String[] sharedWith;


    public String getUsername(){
        return this.username;
    }
    
    public void setUsername(String username){
        this.username = username;
    }
    public String getName(){
        return this.name;
    }
    public void SetName(String name){
        this.name = name;
    }
    public String getSeries(){
        return this.series;
    }
    public void setSeries(String series){
        this.series = series;
    }

    public String[] getSharedWith(){
        return this.sharedWith;
    }
    public void setSharedWith(String[] sharedWith){
        this.sharedWith = sharedWith;
    }
}