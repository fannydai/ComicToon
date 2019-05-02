package com.example.ComicToon.Models.RequestResponseModels;
import com.example.ComicToon.Models.RequestResponseModels.ViewAllComicsResult;
import java.util.ArrayList;

public class BundleViewAllComics {
    private ArrayList<ViewAllComicsResult> allComics = new ArrayList<>();
    private String result;

    public void setBundleComicList(ArrayList<ViewAllComicsResult> allComics) {
        this.allComics = allComics;
    }

    public ArrayList<ViewAllComicsResult> getBundleComicList() {
        return this.allComics;
    }

    public void setResult(String result) {
        this.result = result;
    }
    
    public String getResult() {
        return this.result;
    }
}