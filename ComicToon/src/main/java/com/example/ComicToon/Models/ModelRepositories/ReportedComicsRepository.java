package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicModel;
import com.example.ComicToon.Models.ReportedComicsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedComicsRepository extends MongoRepository<ReportedComicsModel, String>{
    public ReportedComicsModel findByid(String id);
    public ReportedComicsModel findByuserID(String userID); //person who reported it
    public ReportedComicsModel findByusername(String username); //person who reported it
    public List<ReportedComicsModel> findAll();
}