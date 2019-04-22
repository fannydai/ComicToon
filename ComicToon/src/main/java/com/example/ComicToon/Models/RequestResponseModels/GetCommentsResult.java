package com.example.ComicToon.Models.RequestResponseModels;

import java.util.ArrayList;
import com.example.ComicToon.Models.CommentModel;

public class GetCommentsResult {
    private String status;
    private ArrayList<CommentModel> comments;

    public String getStatus(){
        return this.status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public ArrayList<CommentModel> getComments() {
        return comments;
    }

    public void setComments(ArrayList<CommentModel> comments) {
        this.comments = comments;   
    }
}