package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicSeriesModel;

public class ViewMySeriesResult {

    private ArrayList<ComicSeriesModel> comics;

    public ArrayList<ComicSeriesModel> getComicSeries() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicSeriesModel> comics) {
        this.comics = comics;
    }



}