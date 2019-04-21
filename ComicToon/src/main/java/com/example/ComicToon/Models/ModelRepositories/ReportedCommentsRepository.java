package com.example.ComicToon.Models.ModelRepositories;
import java.util.List;
import com.example.ComicToon.Models.ReportedCommentsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedCommentsRepository extends MongoRepository<ReportedCommentsModel, String>{
    public ReportedCommentsModel findByid(String id);
    public ReportedCommentsModel findByuserID(String userID); //person who reported
    public ReportedCommentsModel findByusername(String username); // same^^
    public List<ReportedCommentsModel> findAll();
}