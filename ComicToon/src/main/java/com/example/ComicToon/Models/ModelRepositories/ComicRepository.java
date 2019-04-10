package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.ComicModel;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;

public interface ComicRepository extends MongoRepository<ComicModel, String>{
    public ComicModel findByid(String ID);
    public void deleteById(String id);
    public ArrayList<ComicModel> findByUserID(String userID);
    public ArrayList<ComicModel> findByname(String name);
    public List<ComicModel> findAll();
}