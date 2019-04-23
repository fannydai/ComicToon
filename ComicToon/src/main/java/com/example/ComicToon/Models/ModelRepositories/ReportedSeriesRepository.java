package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;
import com.example.ComicToon.Models.ReportedSeriesModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedSeriesRepository extends MongoRepository<ReportedSeriesModel, String>{
    public ReportedSeriesModel findByid(String id);
    public List<ReportedSeriesModel> findByuserID(String userID); //person who's reporting
    public List<ReportedSeriesModel> findByseriesID(String seriesID); //all instances of series reported
    public List<ReportedSeriesModel> findAll();
}