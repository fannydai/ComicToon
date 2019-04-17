package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicSeriesModel;

public class ViewSubscriptionsResult {
    private ArrayList<ComicSeriesModel> series;

    /**
     * @return the series
     */
    public ArrayList<ComicSeriesModel> getSeries() {
        return series;
    }

    /**
     * @param series the series to set
     */
    public void setSeries(ArrayList<ComicSeriesModel> series) {
        this.series = series;
    }


}