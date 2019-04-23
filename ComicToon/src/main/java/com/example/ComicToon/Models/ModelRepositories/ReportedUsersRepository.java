package com.example.ComicToon.Models.ModelRepositories;

import java.util.List;
import com.example.ComicToon.Models.ReportedUsersModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedUsersRepository extends MongoRepository<ReportedUsersModel, String>{
    public ReportedUsersModel findByid(String id);
    public List<ReportedUsersModel> findByuserID(String userID); //person who's reporting
    public List<ReportedUsersModel> findByreportedUserID(String reportedUserID); //person got reported
    public List<ReportedUsersModel> findAll();
}