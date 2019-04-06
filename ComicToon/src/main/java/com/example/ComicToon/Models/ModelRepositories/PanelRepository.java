package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;

import com.example.ComicToon.Models.PanelModel;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface PanelRepository extends MongoRepository<PanelModel, String>{
    public PanelModel findByID(String id);
    public List<PanelModel> findAll();
}