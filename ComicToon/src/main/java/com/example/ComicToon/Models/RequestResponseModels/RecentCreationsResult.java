package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;

public class RecentCreationsResult {
    private ArrayList<ComicModel> comics;

    /**
     * @return the comics
     */
    public ArrayList<ComicModel> getComics() {
        return comics;
    }

    /**
     * @param comics the comics to set
     */
    public void setComics(ArrayList<ComicModel> comics) {
        this.comics = comics;
    }


}