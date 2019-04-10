package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;

public class ViewAllComicsResult {
    private ArrayList<ComicModel> allComics = new ArrayList<>();

    public void setComicList(ArrayList<ComicModel> allComics) {
        this.allComics = allComics;
    }

    public ArrayList<ComicModel> getComicList() {
        return this.allComics;
    }
}