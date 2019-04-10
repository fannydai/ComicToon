package com.example.ComicToon.Controllers;

import com.example.ComicToon.Models.*;
import com.example.ComicToon.Models.ModelRepositories.*;
import com.example.ComicToon.Models.RequestResponseModels.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
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


    //Create Comic Series

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/create/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicSeriesResult createComicSeries(@RequestBody CreateComicSeriesForm form){
        CreateComicSeriesResult result = new CreateComicSeriesResult();
        UserModel user = userRepository.findByusername(form.getUsername());
        System.out.println(user);
        if (user == null){
            result.setResult("user does not exists");
            return result;
        }
        else{
            //create and save new series
            ComicSeriesModel newComicSeries = new ComicSeriesModel(form.getName(), form.getDescription(), user.getId(), form.getPrivacy(), form.getGenre());
            ComicSeriesRepository.save(newComicSeries);
            //add comicseries id -> user
            user.getComicSeries().add(newComicSeries.getId());
            userRepository.save(user);
            result.setResult("success");
            
        }
        return result;
    }

    //Delete Comic Series (and of course every comic in the series)
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/delete/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public DeleteComicSeriesResult deleteComicSeries(@RequestBody DeleteComicSeriesForm form){
        DeleteComicSeriesResult result = new DeleteComicSeriesResult();

        ArrayList<ComicSeriesModel> candidates = ComicSeriesRepository.findByname(form.getSeriesName());
        UserModel owner = userRepository.findByusername(form.getOwnerName());
        if(candidates == null || owner == null){
            result.setResult("failure");
            return result;
        }
        else{
            for(ComicSeriesModel candidate: candidates){
                if(candidate.getUserID().equals(owner.getId())){
                    ComicSeriesModel toDelete = candidate;
                    for(String c: toDelete.getComics()){
                        ArrayList<ComicModel> candidates2 = comicRepository.findByname(c);
                        for(ComicModel d : candidates2){
                            if(d.getUserID().equals(owner.getId())){
                                comicRepository.delete(d);
                                break;
                            }

                        }
                    }
                    ComicSeriesRepository.delete(toDelete);
                    break;
                }
            }
            result.setResult("Deleted series & all enclosed comics");
        }

        return result;
    }

    //View Comic Series (not my series thats different)
        //show all comics (links?) in series

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/comic-series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewComicSeriesResult viewComicSeries(@RequestBody ViewComicSeriesForm form){
        ViewComicSeriesResult result = new ViewComicSeriesResult();
        result.setComics(new ArrayList<ComicModel>());

        ArrayList <ComicSeriesModel> candidates = ComicSeriesRepository.findByname(form.getComicSeriesName());
        if (candidates.size() == 0) {
            result.setResult("failure");
            return result;
        }
        UserModel owner = userRepository.findByusername(form.getOwnerName());
        System.out.println("VIEWING SERIES");
        System.out.println(form.getOwnerName());
        System.out.println(owner.getId());
        System.out.println(candidates.size());
        for (ComicSeriesModel candidate: candidates){
            System.out.println(candidate.getUserID());
            if(candidate.getUserID().equals(owner.getId())){
                for(String comicID : candidate.getComics()){
                    ComicModel comic = comicRepository.findByid(comicID);
                    if (comic != null) {
                        result.getComics().add(comic);
                    }
                }
                break;
            }
        }
        result.setResult("success");
        return result;
    }


    //Create Comic
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
                System.out.println(form.getUsername());
                //create and save new comic
                Date date = new Date();
                String strDate = date.toString();
                ComicModel newComic = new ComicModel(form.getName(),form.getDescription(),user.getId(),form.getUsername(),series.getId(),strDate, form.getSharedWith());
                // Create Panels for each and set references in comic
                ArrayList<String> canvasList = form.getCanvases();
                ArrayList<String> imageList = form.getImages();
                ArrayList<String> panelRefs = new ArrayList<>();
                for (int i = 0; i < canvasList.size(); i++) {
                    PanelModel newPanel = new PanelModel(imageList.get(i), canvasList.get(i), newComic.getId());
                    panelRepository.save(newPanel);
                    panelRefs.add(newPanel.getId());
                }
                newComic.setPanelsList(panelRefs);
                comicRepository.save(newComic);

                //now add comic reference to user
                user.getComics().add(newComic.getId());
                userRepository.save(user);

                //now add comic reference to comic series
                series.getComics().add(newComic.getId());
                ComicSeriesRepository.save(series);
                result.setResult("success");
            }
            else{
                result.setResult("comic series does not exists");
            return result;
            }
        }


        return result;
    }

    //Delete Comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/delete/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public DeleteComicResult deleteComic(@RequestBody DeleteComicForm form){
        DeleteComicResult result = new DeleteComicResult();
        ArrayList<ComicModel> findComicList = comicRepository.findByname(form.getComicName());
        UserModel findUser = userRepository.findByusername(form.getOwnerName());
        if(findComicList.isEmpty() || findUser == null){
            result.setResult("failed");
        }
        else{

            for(ComicModel r : findComicList){
                if(r.getUserID().equals(findUser.getId())){
                    ComicSeriesModel series = ComicSeriesRepository.findByid(r.getComicSeriesID());
                    series.getComics().remove(r.getId());
                    ComicSeriesRepository.save(series);
                    comicRepository.delete(r);
                    result.setResult("Deleted Comic and reference in its series");

                }
            }
        }



        return result;
    }


    //View Comic 
    //TODO SUGGESTION
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewComicResult viewComic(@RequestBody ViewComicForm form){
        ViewComicResult result = new ViewComicResult();
        System.out.println("VIEW COMIC");
        ArrayList<ComicModel> findComicList = comicRepository.findByname(form.getComicName());
        ComicModel findComic = null;
        for(ComicModel c: findComicList){
            System.out.println(c.getUsername());
            System.out.println(form.getComicOwnerName());
            if(c.getUsername().equals(form.getComicOwnerName()))
                findComic = c;
        }
        System.out.println(findComic);
        
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
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/allComics", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics viewAllComics(@RequestBody ViewAllComicsForm form){
        BundleViewAllComics result = new BundleViewAllComics();
        UserModel theUser = userRepository.findByusername(form.getComicOwnerName());
        List<ComicModel> findComicList = comicRepository.findByUserID(theUser.getId());
        if(findComicList != null){
            for(int i=0; i<findComicList.size(); i++){
                ComicModel temp = findComicList.get(i);
                ViewAllComicsResult pans = new ViewAllComicsResult();
                pans.setComicName(temp.getName());
                for(int j=0; j<temp.getPanelsList().size(); j++){
                    PanelModel real = panelRepository.findByid(temp.getPanelsList().get(j));
                    pans.getComicList().add(real);
                }
                result.getBundleComicList().add(pans);
            }
        }
        return result;
    }


    //The "my" use cases are bellow

    //View Own Comic Series
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewMySeriesResult viewMySeries(@RequestBody ViewMySeriesForm form){
        ViewMySeriesResult result = new ViewMySeriesResult();
        UserModel user = userRepository.findByusername(form.getUsername());
        if(user == null){
            return result;
        }else{
            for (String seriesID : user.getComicSeries()){
                ComicSeriesModel series = ComicSeriesRepository.findByid(seriesID);
                result.getComicSeries().add(series);
            }
        }
        return result;
    }

    //Subscribe to series
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/subscribe", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public SubscriptionResult subscribe(@RequestBody SubscriptionForm form){
        SubscriptionResult result = new SubscriptionResult();

        UserModel user = userRepository.findByusername(form.getUsername());
        if(user == null)
            return result;
        else{
            user.getSubscriptions().add(form.getSeriesid());
            result.setResult("success");
        }
        return result;
    }

    //View Subscriptions (list of subscriptions of a user -> not same as the subscriptions section of homepage)
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/subscriptions", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewSubscriptionsResult viewSubscriptions(@RequestBody ViewSubscriptionsForm form){
        ViewSubscriptionsResult result = new ViewSubscriptionsResult();
        UserModel user = userRepository.findByusername(form.getUsername());
        if(user==null){
            return result;
        }
        for(String subscriptionsid : user.getSubscriptions()){
            result.getSeries().add(ComicSeriesRepository.findByid(subscriptionsid));
        }
        return result;
    }

    // View Recent Creations
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/welcomerecent", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RecentCreationsResult recent(@RequestBody ViewAllComicsForm form){
        List<ComicModel> comics = comicRepository.findAll();
        RecentCreationsResult result = new RecentCreationsResult(comics);
        // for(ComicModel comic : result.getComics()) {
        //     System.out.println(comic.getDate());
        // }
        return result;
    }

    //Get a single panel
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/panel", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewPanelResult viewPanel(@RequestBody ViewPanelForm form){
        System.out.println("GETTING A PANEL");
        ViewPanelResult result = new ViewPanelResult();
        System.out.println(form.getId());
        PanelModel panel = panelRepository.findByid(form.getId());
        if (panel != null) {
            result.setPanel(panel);
        }
        return result;
    }

    //OTHERS (After benchmark 1)

    //Subscribe To Comic

    //Rate Comic

    //Download Comic

    //Comment on Comic
}