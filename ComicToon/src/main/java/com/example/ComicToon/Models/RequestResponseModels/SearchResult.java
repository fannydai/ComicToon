package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ComicSeriesModel;
import com.example.ComicToon.Models.UserModel;

public class SearchResult {
    private ArrayList<UserModel> users;
    private ArrayList<ComicSeriesModel> all_series;
    private ArrayList<ComicModel> all_comics;

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

}