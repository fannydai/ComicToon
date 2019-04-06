package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.RatingModel;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface RatingRepository extends MongoRepository<RatingModel, String>{
    public RatingModel findByid(String id);
    public List<RatingModel> findAll();
}