package com.example.ComicToon.Models.RequestResponseModels;

import com.example.ComicToon.Models.ComicSeriesModel;

public class ViewSeriesDataResult {
    private ComicSeriesModel result;

    public ComicSeriesModel getResult() {
        return this.result;
    }

    public void setResult(ComicSeriesModel result) {
        this.result = result;
    }
}