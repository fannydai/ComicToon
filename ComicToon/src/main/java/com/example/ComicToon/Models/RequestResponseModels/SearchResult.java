package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ComicSeriesModel;
import com.example.ComicToon.Models.UserModel;

public class SearchResult {
    private UserModel user;
    private ArrayList<ComicSeriesModel> all_series;
    private ArrayList<ComicModel> all_comics;

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public ArrayList<ComicSeriesModel> getAll_series() {
        return all_series;
    }

    public void setAll_series(ArrayList<ComicSeriesModel> all_series) {
        this.all_series = all_series;
    }

    public ArrayList<ComicModel> getAll_comics() {
        return all_comics;
    }

    public void setAll_comics(ArrayList<ComicModel> all_comics) {
        this.all_comics = all_comics;
    }

}