package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicSeriesModel;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;

public interface ComicSeriesRepository extends MongoRepository<ComicSeriesModel, String>{
    public ComicSeriesModel findByid(String id);
    public ArrayList <ComicSeriesModel> findByname(String name);
    public List<ComicSeriesModel> findAll();
}