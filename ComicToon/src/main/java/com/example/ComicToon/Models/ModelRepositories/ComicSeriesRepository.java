package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicSeriesModel;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface ComicSeriesRepository extends MongoRepository<ComicSeriesModel, String>{
    public ComicSeriesModel findByid(String id);
    public ComicSeriesModel findByname(String name);
    public List<ComicSeriesModel> findAll();
}