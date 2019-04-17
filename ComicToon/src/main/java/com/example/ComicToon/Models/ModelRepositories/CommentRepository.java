package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.CommentModel;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface CommentRepository extends MongoRepository<CommentModel, String>{
    public CommentModel findByid(String id);
    public List<CommentModel> findAll();
}