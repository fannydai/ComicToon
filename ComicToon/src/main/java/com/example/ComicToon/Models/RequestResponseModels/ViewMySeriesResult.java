package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicSeriesModel;

public class ViewMySeriesResult {
    private String result;
    private ArrayList<ComicSeriesModel> comics = new ArrayList<>();

    public String getResult() {
        return this.result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public ArrayList<ComicSeriesModel> getComicSeries() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicSeriesModel> comics) {
        this.comics = comics;
    }



}