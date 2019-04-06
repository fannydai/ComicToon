package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicModel;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface ComicRepository extends MongoRepository<ComicModel, String>{
    public ComicModel findByID(String id);
    public List<ComicModel> findAll();
}