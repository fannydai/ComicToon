package com.example.ComicToon.Controllers;

import com.example.ComicToon.Models.*;
import com.example.ComicToon.Models.ModelRepositories.*;
import com.example.ComicToon.Models.RequestResponseModels.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Date;

@RestController
public class ComicController{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ComicRepository comicRepository;
    @Autowired
    private ComicSeriesRepository ComicSeriesRepository;
    @Autowired
    private PanelRepository panelRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private RatingRepository ratingRepository;


    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/create/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicSeriesResult createComicSeries(@RequestBody CreateComicSeriesForm form){
        CreateComicSeriesResult result = new CreateComicSeriesResult();
        UserModel user = userRepository.findByusername(form.getUsername());
        if (user == null){
            result.setResult("user does not exists");
            return result;
        }
        else{
            //create and save new series
            ComicSeriesModel newComicSeries = new ComicSeriesModel(form.getName(),user.getId(),form.getPrivacy(), form.getGenre());
            ComicSeriesRepository.save(newComicSeries);
            //add comicseries id -> user
            user.getComicSeries().add(newComicSeries.getId());
            userRepository.save(user);
            result.setResult("success");
            
        }
        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/create/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicResult createComic(@RequestBody CreateComicForm form){
        CreateComicResult result = new CreateComicResult();

        UserModel user = userRepository.findByusername(form.getUsername());
        if (user == null){
            result.setResult("user does not exists");
            return result;
        }
        else{
            ArrayList<ComicSeriesModel> seriesList = ComicSeriesRepository.findByname(form.getSeries());
            ComicSeriesModel series = null;
            for(ComicSeriesModel s : seriesList){
                if(s.getUserID().equals(user.getId()))
                    series = s;
            }
            if(series!=null){
                //create and save new comic
                Date date = new Date();
                String strDate = date.toString();
                ComicModel newComic = new ComicModel(form.getName(),user.getId(),series.getId(),strDate, form.getSharedWith());
                comicRepository.save(newComic);

                //now add comic reference to user
                user.getComics().add(newComic.getId());
                userRepository.save(user);

                //now add comic reference to comic series
                series.getComics().add(newComic.getId());
                ComicSeriesRepository.save(series);
                result.setResult("Sucess");
            }
            else{
                result.setResult("comic series does not exists");
            return result;
            }
        }


        return result;
    }

    //TODO SUGGESTION
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewComicResult viewComic(@RequestBody ViewComicForm form){
        ViewComicResult result = new ViewComicResult();
        ArrayList<ComicModel> findComicList = comicRepository.findByname(form.getComicName());
        ComicModel findComic = null;
        for(ComicModel c: findComicList){
            if(c.getUserID().equals(form.getComicOwnerName()))
                findComic = c;
        }
        
        if(findComic!=null){

            ComicSeriesModel series = ComicSeriesRepository.findByid(findComic.getComicSeriesID());
            ArrayList<CommentModel> comments = new ArrayList<CommentModel>();
            ArrayList<RatingModel> ratings = new ArrayList<RatingModel>();
            ArrayList<PanelModel> panels = new ArrayList<PanelModel>();

            result.setComicName(findComic.getName());
            result.setCreatorName(form.getComicOwnerName());
            result.setSeriesName(series.getName());
            for(String c: findComic.getCommentsList()){
                CommentModel findComment = commentRepository.findByid(c);
                if(findComment!=null){
                    comments.add(findComment);
                }
            }
            result.setCommentsList(comments);

            for(String r: findComic.getRatingsID()){
                RatingModel rating = ratingRepository.findByid(r);
                if(rating!=null){
                    ratings.add(rating);
                }
            }

            result.setRatingsID(ratings);

            for(String p: findComic.getPanelsList()){
                PanelModel panel = panelRepository.findByid(p);
                if(panel !=null){
                    panels.add(panel);
                }
            }
            result.setPanels(panels);

            result.setSuggestions(null);


        }
        else{
            return result;
        }
        


        return result;
    }

}