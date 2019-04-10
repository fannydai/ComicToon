package com.example.ComicToon.Models.RequestResponseModels;

import java.util.List;
import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;

public class RecentCreationsResult{
    private List<ComicModel> comics;

    public RecentCreationsResult() {
        this.comics = new ArrayList<ComicModel>();
    }

    public RecentCreationsResult(List<ComicModel> comics) {
        this.comics = comics;
    }

    /**
     * @return the comics
     */
    public List<ComicModel> getComics() {
        return comics;
    }

    /**
     * @param comics the comics to set
     */
    public void setComics(List<ComicModel> comics) {
        this.comics = comics;
    }
}