package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;
import com.example.ComicToon.Models.ReportedUsersModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedUsersRepository extends MongoRepository<ReportedUsersModel, String>{
    public ReportedUsersModel findByid(String id);
    public ReportedUsersModel findByuserID(String userID);
    public ReportedUsersModel findByusername(String username);
    public List<ReportedUsersModel> findAll();
}