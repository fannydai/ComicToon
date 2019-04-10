package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.PanelModel;

public class ViewAllComicsResult {
    private ArrayList<PanelModel> allComicsPanels = new ArrayList<>();

    public void setComicList(ArrayList<PanelModel> allComicsPanels) {
        this.allComicsPanels = allComicsPanels;
    }

    public ArrayList<PanelModel> getComicList() {
        return this.allComicsPanels;
    }
}