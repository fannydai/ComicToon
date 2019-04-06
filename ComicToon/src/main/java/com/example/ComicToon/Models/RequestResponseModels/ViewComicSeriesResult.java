package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;

public class ViewComicSeriesResult {

    private ArrayList<ComicModel> comics;

    public ArrayList<ComicModel> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicModel> comics) {
        this.comics = comics;
    }



}
