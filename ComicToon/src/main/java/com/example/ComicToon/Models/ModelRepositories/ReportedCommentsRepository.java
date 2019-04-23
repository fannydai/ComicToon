package com.example.ComicToon.Models.ModelRepositories;
import java.util.List;
import com.example.ComicToon.Models.ReportedCommentsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportedCommentsRepository extends MongoRepository<ReportedCommentsModel, String>{
    public ReportedCommentsModel findByid(String id);
    public List<ReportedCommentsModel> findByuserID(String userID); //person who's reporting
    public List<ReportedCommentsModel> findBycommentID(String commentID);//all instances of comment reported
    public List<ReportedCommentsModel> findAll();
}