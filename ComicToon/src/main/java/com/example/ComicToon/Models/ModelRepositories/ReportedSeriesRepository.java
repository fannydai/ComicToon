package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;
import com.example.ComicToon.Models.ReportedSeriesModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedSeriesRepository extends MongoRepository<ReportedSeriesModel, String>{
    public ReportedSeriesModel findByid(String id);
    public ReportedSeriesModel findByuserID(String userID); //person who reported
    public ReportedSeriesModel findByusername(String username); //same^^
    public List<ReportedSeriesModel> findAll();
}