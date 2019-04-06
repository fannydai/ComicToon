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
            ComicSeriesModel series = ComicSeriesRepository.findByname(form.getSeries());
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
}