package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;

public class ViewComicSeriesResult {
    private ArrayList<ComicModel> comics;
    private String result;

    public ArrayList<ComicModel> getComics() {
        return this.comics;
    }

    public void setComics(ArrayList<ComicModel> comics) {
        this.comics = comics;
    }

    public String getResult() {
        return this.result;
    }

    public void setResult(String result) {
        this.result = result;
    }

}
