package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ReportedComicsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedComicsRepository extends MongoRepository<ReportedComicsModel, String>{
    public ReportedComicsModel findByid(String id);
    public List<ReportedComicsModel> findByuserID(String userID); //person who's reporting
    public List<ReportedComicsModel> findAll();
}