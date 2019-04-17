package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.PanelModel;

public class ViewAllComicsResult {
    private String comicName;
    private String comicId;
    private ArrayList<PanelModel> allComicsPanels = new ArrayList<>();

    public void setComicList(ArrayList<PanelModel> allComicsPanels) {
        this.allComicsPanels = allComicsPanels;
    }

    public ArrayList<PanelModel> getComicList() {
        return this.allComicsPanels;
    }

    public String getComicName(){
        return this.comicName;
    }

    public void setComicName(String comicName){
        this.comicName = comicName;
    }

    public String getComicID(){
        return this.comicId;
    }

    public void setComicID(String comicId){
        this.comicId = comicId;
    }
}