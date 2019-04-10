package com.example.ComicToon.Models.RequestResponseModels;

import java.util.Comparator;
import java.util.List;


import com.example.ComicToon.Models.ComicModel;

public class RecentCreationsResult{
    private List<ComicModel> comics;
    private static final int amtRecent = 10;

    public RecentCreationsResult(List<ComicModel> comics) {
        this.setComics(comics);
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
        if(comics == null || comics.size()==0) {
            this.comics = comics;
        } else {
            this.comics.clear();
            comics.sort(Comparator.comparing(ComicModel::getDate));

            int max = amtRecent > comics.size() ? amtRecent : comics.size();
            for(int i=0; i<max; i++) {
                this.comics.add(comics.get(i));
            }
        }
    }
}