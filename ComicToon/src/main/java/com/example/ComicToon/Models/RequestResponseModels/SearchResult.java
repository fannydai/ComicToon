package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ComicSeriesModel;
import com.example.ComicToon.Models.UserModel;

public class SearchResult {
    private ArrayList<UserModel> users;
    private ArrayList<ComicSeriesModel> all_series;
    private ArrayList<String> seriesOwners;
    private ArrayList<ViewAllComicsResult> all_comics;

    public ArrayList<ComicSeriesModel> getAll_series() {
        return all_series;
    }

    public void setAll_series(ArrayList<ComicSeriesModel> all_series) {
        this.all_series = all_series;
    }

    public ArrayList<ViewAllComicsResult> getAll_comics() {
        return all_comics;
    }

    public void setAll_comics(ArrayList<ViewAllComicsResult> all_comics) {
        this.all_comics = all_comics;
    }

    /**
     * @return the users
     */
    public ArrayList<UserModel> getUsers() {
        return users;
    }

    /**
     * @param user the users to set
     */
    public void setUsers(ArrayList<UserModel> users) {
        this.users = users;
    }

    /**
     * @return the seriesOwners
     */
    public ArrayList<String> getSeriesOwners() {
        return seriesOwners;
    }

    /**
     * @param seriesOwners the seriesOwners to set
     */
    public void setSeriesOwners(ArrayList<String> seriesOwners) {
        this.seriesOwners = seriesOwners;
    }

}