package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.CommentModel;
import com.example.ComicToon.Models.PanelModel;
import com.example.ComicToon.Models.RatingModel;

public class ViewComicResult {
    private String comicName;
    private String creatorName;
    private String seriesName;
    private String description;
    private String privacy;
    private ArrayList<PanelModel> panels;
    private ArrayList<RatingModel> RatingsID;
    private ArrayList <CommentModel> commentsList;
    private ArrayList<ComicModel> suggestions;
    private ArrayList<String> sharedWith;

    public String getCreatorName() {
        return this.creatorName;
    }

    /**
     * @return the suggestions
     */
    public ArrayList<ComicModel> getSuggestions() {
        return suggestions;
    }

    /**
     * @param suggestions the suggestions to set
     */
    public void setSuggestions(ArrayList<ComicModel> suggestions) {
        this.suggestions = suggestions;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getSeriesName() {
        return this.seriesName;
    }

    public void setSeriesName(String seriesName) {
        this.seriesName = seriesName;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrivacy() {
        return this.privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public ArrayList<PanelModel> getPanels() {
        return this.panels;
    }

    public void setPanels(ArrayList<PanelModel> panels) {
        this.panels = panels;
    }

    public ArrayList<RatingModel> getRatingsID() {
        return this.RatingsID;
    }

    public void setRatingsID(ArrayList<RatingModel> RatingsID) {
        this.RatingsID = RatingsID;
    }

    public ArrayList<CommentModel> getCommentsList() {
        return this.commentsList;
    }

    public void setCommentsList(ArrayList<CommentModel> commentsList) {
        this.commentsList = commentsList;
    }

    public String getComicName(){
        return this.comicName;
    }

    public void setComicName(String comicName){
        this.comicName = comicName;
    }

    public ArrayList<String> getSharedWith() {
        return this.sharedWith;
    }

    public void setSharedWith(ArrayList<String> sharedWith) {
        this.sharedWith = sharedWith;
    }
}