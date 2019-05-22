package com.example.ComicToon.Controllers;

import com.example.ComicToon.Models.*;
import com.example.ComicToon.Models.ModelRepositories.*;
import com.example.ComicToon.Models.RequestResponseModels.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Collections;
// import java.util.Comparator;
import java.text.SimpleDateFormat;
import java.text.ParseException;

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
    @Autowired
    private ReportedUsersRepository reportedUsersRepo;
    @Autowired
    private ReportedComicsRepository reportedComicsRepo;
    @Autowired
    private ReportedSeriesRepository reportedSeriesRepo;
    @Autowired
    private ReportedCommentsRepository reportedCommentsRepo;


    //Create Comic Series
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/create/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicSeriesResult createComicSeries(@RequestBody CreateComicSeriesForm form){
        CreateComicSeriesResult result = new CreateComicSeriesResult();
        UserModel user = userRepository.findBytoken(form.getUsername());
        System.out.println(user);
        if (user == null){
            result.setResult("tokenerror");
            return result;
        } else{
            //Look for another one under the user
            ArrayList<ComicSeriesModel> foundSeries = ComicSeriesRepository.findByname(form.getName());
            for (ComicSeriesModel series : foundSeries) {
                if (series.getUserID().equals(user.getId())) {
                    System.out.println("FOUND DUPLICATE");
                    result.setResult("You already have a series with this name!");
                    return result;
                }
            }
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
        UserModel owner = userRepository.findBytoken(form.getOwnerName());
        if(candidates == null || owner == null){
            result.setResult("failure");
            return result;
        } else{
            for(ComicSeriesModel candidate: candidates){
                System.out.println("in first loop..");
                System.out.println(candidate);
                System.out.println(owner);
                if(candidate.getUserID().equals(owner.getId())){
                    ComicSeriesModel toDelete = candidate;
                    for(String c: toDelete.getComics()){
                        System.out.println("in second loop..");
                        System.out.println(c);
                        ArrayList<ComicModel> candidates2 = new ArrayList<>();
                        candidates2.add(comicRepository.findByid(c));
                        System.out.println("before 3rd loop..");
                        System.out.println(candidates2);
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
    public BundleViewAllComics viewComicSeries(@RequestBody ViewComicSeriesForm form){
        BundleViewAllComics result = new BundleViewAllComics();
        ArrayList <ComicSeriesModel> candidates = ComicSeriesRepository.findByname(form.getComicSeriesName());
        if (candidates.size() == 0) {
            result.setResult("failure");
            return result;
        }
        UserModel owner = userRepository.findByusername(form.getOwnerName());
        UserModel viewer = userRepository.findBytoken(form.getViewerName());
        if (viewer == null) {
            result.setResult("failure");
            return result;
        }
        System.out.println("VIEWING SERIES");
        System.out.println(form.getOwnerName());
        System.out.println(form.getViewerName());
        System.out.println(owner.getId());
        System.out.println(candidates.size());
        for (ComicSeriesModel candidate: candidates){
            System.out.println(candidate.getUserID());
            if(candidate.getUserID().equals(owner.getId())){
                // Check permission
                ArrayList<String> shared = candidate.getSharedWith();
                if (!form.getOwnerName().equals(viewer.getUsername()) && candidate.getPrivacy().equals("Private") && !shared.contains(viewer.getUsername())) {
                    result.setResult("error");
                    return result;
                }
                for(String comicID : candidate.getComics()){
                    System.out.println("GETTING COMICS");
                    ComicModel comic = comicRepository.findByid(comicID);
                    if (comic != null) {
                        System.out.println("FORMATTING COMIC");
                        //result.getComics().add(comic);
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                        pans.setComicName(comic.getName());
                        pans.setComicID(comic.getId());
                        pans.setComicSeriesName(candidate.getName());
                        pans.setUsername(owner.getUsername());
                        pans.setDate(comic.getDate());
                        for(int j=0; j<comic.getPanelsList().size(); j++){
                            PanelModel real = panelRepository.findByid(comic.getPanelsList().get(j));
                            pans.getComicList().add(real);
                        }
                        result.getBundleComicList().add(pans);
                    }
                }
                break;
            }
        }
        result.setResult("success");
        return result;
    }

    // Get data for a series using series ID
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/series-data", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewSeriesDataResult viewSeriesData(@RequestBody ViewSeriesDataForm form) {
        ViewSeriesDataResult result = new ViewSeriesDataResult();
        result.setResult(ComicSeriesRepository.findByid(form.getId()));
        return result;
    }

    // View series with permission or is public
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/series-viewable", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewMySeriesResult viewSeriesViewable(@RequestBody ViewMySeriesForm form) {
        ViewMySeriesResult result = new ViewMySeriesResult();
        UserModel user = userRepository.findBytoken(form.getToken());
        if (user == null) {
            result.setResult("tokenerror");
            return result;
        }
        UserModel owner = userRepository.findByusername(form.getUsername());
        List<ComicSeriesModel> series = ComicSeriesRepository.findAll();
        ArrayList<ComicSeriesModel> allowed = new ArrayList<>();
        for (ComicSeriesModel s : series) {
            if (s.getUserID().equals(owner.getId()) && (s.getUserID().equals(user.getId()) || s.getPrivacy().equals("Public") || s.getSharedWith().contains(user.getUsername()))) {
                allowed.add(s);
            }
        }
        result.setResult("success");
        result.setComics(allowed);
        return result;
    }


    //Create Comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/create/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicResult createComic(@RequestBody CreateComicForm form){
        CreateComicResult result = new CreateComicResult();

        UserModel user = userRepository.findBytoken(form.getToken());
        if (user == null){
            result.setResult("user does not exists");
            return result;
        } else if (!user.getToken().equals(form.getToken())) {
            result.setResult("invalid token");
            return result;
        } else{
            ArrayList<ComicSeriesModel> seriesList = ComicSeriesRepository.findByname(form.getSeries());
            ComicSeriesModel series = null;
            for(ComicSeriesModel s : seriesList){
                if(s.getUserID().equals(user.getId()))
                    series = s;
            }
            if(series!=null){
                System.out.println(form.getUsername());
                // Make sure there is no comic by this name under this series
                ArrayList<ComicModel> check = comicRepository.findByUserID(user.getId());
                for (ComicModel c : check) {
                    if (c.getName().equals(form.getName()) && c.getComicSeriesID().equals(series.getId())) {
                        result.setResult("You already have a comic with that name under this series");
                        return result;
                    }
                }

                //create and save new comic
                Date date = new Date();
                String strDate = date.toString();
                ComicModel newComic = new ComicModel(form.getName(),form.getDescription(),user.getId(),form.getUsername(),series.getId(),strDate, form.getSharedWith(), form.getPrivacy(), true);
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

                ArrayList<String> sharedUsers = form.getSharedWith(); //add to corresponding user
                if(sharedUsers.size() != 0 && sharedUsers != null){
                    for(String str: sharedUsers){
                        UserModel temp = userRepository.findByusername(str);
                        if(temp != null) {
                            ArrayList<String> data = new ArrayList<>();
                            data.add(form.getUsername()); //0
                            data.add(form.getName()); //1
                            temp.getSharedComics().add(data);
                            userRepository.save(temp);
                        }
                    }
                }

                //now add comic reference to comic series
                series.getComics().add(newComic.getId());
                ComicSeriesRepository.save(series);
                result.setResult("success");
            } else{
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
        UserModel findUser = userRepository.findBytoken(form.getOwnerName());
        if(findComicList.isEmpty() || findUser == null){
            result.setResult("failed");
        } else{
            for(ComicModel r : findComicList){
                if(r.getUserID().equals(findUser.getId())){
                    ComicSeriesModel series = ComicSeriesRepository.findByid(r.getComicSeriesID());
                    series.getComics().remove(r.getId());
                    ComicSeriesRepository.save(series);
                    ArrayList<String> users = r.getSharedWith(); //remove access from other users too
                    if(users.size() != 0){
                        for(String str : users){
                            UserModel u = userRepository.findByusername(str);
                            if(u != null){
                                ArrayList<ArrayList<String>> shared = u.getSharedComics();

                                for(ArrayList<String> x : shared){
                                    if(x.get(0).equals(r.getUsername()) && x.get(1).equals(r.getName())){ 
                                        shared.remove(x);
                                        userRepository.save(u);
                                        break;
                                    }
                                }
                            }
                        }   
                    }
                    List<UserModel> all = userRepository.findAll();
                    for(UserModel us: all){
                        if(us.getFavorites().contains(r.getId())){
                            us.getFavorites().remove(r.getId());
                            userRepository.save(us);
                        }
                    }
                    comicRepository.delete(r);
                    result.setResult("Deleted Comic and reference in its series");
                }
            }
        }
        return result;
    }

    //Upload Comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/upload", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public UploadComicResult uploadComic(@RequestBody UploadComicForm form) {
        UploadComicResult result = new UploadComicResult();
        System.out.println("UPLOAD COMIC");
        System.out.println(form.getToken());
        System.out.println(form.getUsername());
        System.out.println(form.getDescription());
        System.out.println(form.getName());
        System.out.println(form.getSeries());
        //System.out.println(form.getCanvas());
        //System.out.println(form.getImage());
        System.out.println(form.getSharedWith().size());
        UserModel user = userRepository.findBytoken(form.getToken());
        if (user == null){
            System.out.println("TOKEN IS INVALID");
            result.setResult("Token is invalid");
            return result;
        } else{
            ArrayList<ComicSeriesModel> seriesList = ComicSeriesRepository.findByname(form.getSeries());
            ComicSeriesModel series = null;
            for(ComicSeriesModel s : seriesList){
                if(s.getUserID().equals(user.getId()))
                    series = s;
            }
            if(series!=null){
                System.out.println(form.getUsername());
                // Make sure there is no comic by this name under this series
                ArrayList<ComicModel> check = comicRepository.findByUserID(user.getId());
                for (ComicModel c : check) {
                    if (c.getName().equals(form.getName()) && c.getComicSeriesID().equals(series.getId())) {
                        result.setResult("You already have a comic with that name under this series.");
                        return result;
                    }
                }
                //create and save new comic
                Date date = new Date();
                String strDate = date.toString();
                String canvas = form.getCanvas();
                String image = form.getImage();
                boolean editable = canvas != "" ? true : false;
                ComicModel newComic = new ComicModel(form.getName(),form.getDescription(),user.getId(),form.getUsername(),series.getId(),strDate, form.getSharedWith(), form.getPrivacy(), editable);
                // Create the panel or json
                PanelModel newPanel = new PanelModel(image, canvas, newComic.getId());
                panelRepository.save(newPanel);
                ArrayList<String> singlePanel = new ArrayList<>();
                singlePanel.add(newPanel.getId());
                newComic.setPanelsList(singlePanel);
                comicRepository.save(newComic);

                //now add comic reference to user
                user.getComics().add(newComic.getId());
                userRepository.save(user);

                //now add comic reference to comic series
                series.getComics().add(newComic.getId());
                ComicSeriesRepository.save(series);
                result.setResult("success");
            } else{
                result.setResult("Comic series does not exists.");
                return result;
            }
        }
        return result;
    }

    //Update Series
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/update/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public UpdateSeriesResult updateSeries(@RequestBody UpdateSeriesForm form){
        UpdateSeriesResult result = new UpdateSeriesResult();

        ComicSeriesModel series = ComicSeriesRepository.findByid(form.getSeriesID());
        System.out.println("UPDATING SERIES");
        System.out.println(form.getSeriesID());
        System.out.println(form.getNew_Name());
        System.out.println(form.getNew_Description());
        System.out.println(form.getNew_Privacy());
        if(series!=null){
            series.setName(form.getNew_Name());
            series.setDescription(form.getNew_Description());
            series.setPrivacy(form.getNew_Privacy());
            series.setGenre(form.getNew_Genres());
            series.setSharedWith(form.getNew_SharedWith());
            ComicSeriesRepository.save(series);
            result.setResult("success");
        }

        return result;
    }

    //Update comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/update/comic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CreateComicResult updateComic(@RequestBody UpdateComicForm form){
        CreateComicResult result = new CreateComicResult();
        System.out.println("UPDATING COMIC");
        UserModel theUser = userRepository.findBytoken(form.getUsername());
        String toUpdate = "";
        if(theUser != null){
            ArrayList<ComicModel> the_model = new ArrayList<>();
            if(form.getFlag() == true){
                ArrayList<ArrayList<String>> shared = theUser.getSharedComics();
                for(ArrayList<String> temp: shared){
                    UserModel find = userRepository.findByusername(temp.get(0));
                    if(find != null){
                        ArrayList<ComicModel> all = comicRepository.findByUserID(find.getId());
                        for(ComicModel c: all){
                            if(c.getUsername().equals(find.getUsername()) && c.getName().equals(form.getOldName())){
                                the_model = comicRepository.findByUserID(userRepository.findByusername(c.getUsername()).getId());
                                toUpdate = c.getUsername();
                            }
                        }
                    }
                }
            }
            else    { 
                the_model = comicRepository.findByUserID(theUser.getId());
                toUpdate = theUser.getUsername();  
            }

            // Get the original series
            ArrayList<ComicSeriesModel> allSeries = ComicSeriesRepository.findByname(form.getOldSeries());
            ComicSeriesModel oldSeries = null;
            for (ComicSeriesModel tempSeries : allSeries) {
                if (tempSeries.getUserID().equals(theUser.getId())) {
                    oldSeries = tempSeries;
                    break;
                }
            }
            if ( !form.getFlag() && oldSeries == null) {
                result.setResult("Error: current comic series not found");
                return result;
            }
            System.out.println("there are # of comics under the user:" + the_model.size());
            for(ComicModel comic : the_model){
                if(comic.getName().equals(form.getOldName()) && comic.getComicSeriesID().equals(oldSeries.getId())){//found right one
                    System.out.println("FOUND THE RIGHT ONE");
                    // Check for setting series (cannot have duplicate comic name)
                    ArrayList<ComicModel> comicsByName = comicRepository.findByname(form.getName());
                    for (ComicModel tempComic : comicsByName) {
                        if (form.getOldSeries().equals(form.getSeries()) && form.getName().equals(form.getOldName())) {
                            // If not changing series name, don't need to do this check
                            System.out.println("NOT CHECKING");
                            break;
                        }
                        if (tempComic.getUserID().equals(theUser.getId())) {
                            System.out.println("ANOTHER COMIC BY SAME NAME");
                            ComicSeriesModel checkSeries = ComicSeriesRepository.findByid(tempComic.getComicSeriesID());
                            System.out.println("The series is " + checkSeries.getName());
                            if (checkSeries.getName().equals(form.getSeries())) {
                                result.setResult("A comic with that name already exists in the series.");
                                return result;
                            }
                        }
                    }
                    if(form.getDescription() != null)
                        comic.setDescription(form.getDescription());
                    comic.setName(form.getName());
                    //  Remove references to old series
                    if (oldSeries.getName() != form.getSeries()) {
                        ArrayList<String> oldSeriesComics = oldSeries.getComics();
                        oldSeriesComics.remove(comic.getId());
                        // oldSeries.setComics(oldSeriesComics);
                        ComicSeriesRepository.save(oldSeries);
                        // Replace the comic series reference in the comic
                        ArrayList<ComicSeriesModel> temp = ComicSeriesRepository.findByname(form.getSeries());
                        for (ComicSeriesModel t : temp) {
                            if (t.getUserID().equals(theUser.getId())) {
                                comic.setComicSeriesID(t.getId());
                                ArrayList<String> newSeriesComics = t.getComics();
                                newSeriesComics.add(comic.getId());
                                ComicSeriesRepository.save(t);
                                break;
                            }
                        }
                    }
                    // Delete the old panels and create new ones
                    ArrayList<String> canvases = form.getCanvases();
                    ArrayList<String> images = form.getImages();
                    ArrayList<String> panelRefs = new ArrayList<>();
                    for (String panelID : comic.getPanelsList()) {
                        panelRepository.deleteByid(panelID);
                    }
                    for (int i = 0; i < canvases.size(); i++) {
                        PanelModel newPanel = new PanelModel(images.get(i), canvases.get(i), comic.getId());
                        panelRepository.save(newPanel);
                        panelRefs.add(newPanel.getId());
                    }
                    comic.setPanelsList(panelRefs);

                    ArrayList <String> users = comic.getSharedWith();
                    if(users.size() != 0){
                        for(String str: users){
                            UserModel user = userRepository.findByusername(str);
                            if(user != null){
                                ArrayList<ArrayList<String>> temp = user.getSharedComics();
                                for(ArrayList<String> u: temp){
                                    if(u.get(0).equals(comic.getUsername())& u.get(1).equals(form.getOldName())){
                                        temp.remove(u);
                                        userRepository.save(user);
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    ArrayList<String> newUsers = form.getSharedWith(); // add new references
                    if(newUsers.size() != 0){
                        for(String str : newUsers){
                            UserModel newUser = userRepository.findByusername(str);
                            if(newUser != null){
                            ArrayList<String> newOne = new ArrayList<>();
                            newOne.add(toUpdate);
                            newOne.add(form.getName());
                            newUser.getSharedComics().add(newOne);
                            userRepository.save(newUser);
                            }
                        }
                    }

                    comic.setSharedWith(form.getSharedWith());
                    comic.setDate(new Date().toString());
                    comic.setPrivacy(form.getPrivacy());

                    comicRepository.save(comic);
                    result.setResult("success");
                    break;
                } 
            }
        }
        else {
            result.setResult("error");
        }
        return result;
    }

    // Update Panel
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/update/panel", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public UpdatePanelResult updatePanel(@RequestBody UpdatePanelForm form) {
        UpdatePanelResult result = new UpdatePanelResult();
        PanelModel panel = panelRepository.findByid(form.getId());
        if (panel == null) {
            result.setResult("failure");
            return result;
        }
        panel.setCanvas(form.getCanvas());
        panel.setImage(form.getImage());
        panelRepository.save(panel);
        result.setResult("success");
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
        UserModel user = userRepository.findByusername(form.getComicOwnerName());
        ArrayList<ComicModel> findComicList = comicRepository.findByname(form.getComicName());
        ArrayList<ComicSeriesModel> findComicSeriesList = ComicSeriesRepository.findByname(form.getSeriesName());
        ComicSeriesModel inSeries = null;
        for (ComicSeriesModel x : findComicSeriesList) {
            if (x.getUserID().equals(user.getId())) {
                inSeries = x;
                break;
            }
        }  
        if (inSeries == null) {
            return result;
        }
        ComicModel findComic = null;
        for(ComicModel c: findComicList){
            System.out.println(c.getUsername());
            System.out.println(form.getComicOwnerName());
            if(c.getComicSeriesID().equals(inSeries.getId()) && (c.getUsername().equals(form.getComicOwnerName()) || c.getSharedWith().contains(form.getComicOwnerName())))
                findComic = c;
        }
        System.out.println(findComic);
        
        if(findComic!=null){
            // Check permissions
            ArrayList<String> shared = findComic.getSharedWith();
            /*
            if (!form.getComicOwnerName().equals(form.getViewerName()) && findComic.getPrivacy().equals("Private") && !shared.contains(form.getViewerName())) {
                System.out.println("View comic without permission");
                return result;
            }*/
            ComicSeriesModel series = ComicSeriesRepository.findByid(findComic.getComicSeriesID());
            ArrayList<CommentModel> comments = new ArrayList<CommentModel>();
            ArrayList<RatingModel> ratings = new ArrayList<RatingModel>();
            ArrayList<PanelModel> panels = new ArrayList<PanelModel>();

            result.setComicID(findComic.getId());
            result.setComicName(findComic.getName());
            result.setDescription(findComic.getDescription());
            result.setCreatorName(form.getComicOwnerName());
            result.setSeriesName(series.getName());
            result.setPrivacy(findComic.getPrivacy());
            result.setSharedWith(findComic.getSharedWith());
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
        UserModel theUser = userRepository.findBytoken(form.getToken());
        if (theUser == null || !theUser.getUsername().equals(form.getComicOwnerName())) {
            result.setResult("tokenerror");
            return result;
        }
        List<ComicModel> findComicList = comicRepository.findByUserID(theUser.getId());
        if(findComicList != null){
            for(int i=0; i<findComicList.size(); i++){
                ComicModel temp = findComicList.get(i);
                ViewAllComicsResult pans = new ViewAllComicsResult();
                ComicSeriesModel series = ComicSeriesRepository.findByid(temp.getComicSeriesID());
                pans.setComicSeriesName(series.getName());
                pans.setComicName(temp.getName());
                pans.setComicID(temp.getId());
                pans.setDate(temp.getDate());
                for(int j=0; j<temp.getPanelsList().size(); j++){
                    PanelModel real = panelRepository.findByid(temp.getPanelsList().get(j));
                    pans.getComicList().add(real);
                }
                result.getBundleComicList().add(pans);
            }
        }
        result.setResult("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/getSharedComics", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics getSharedComics(@RequestBody SharedComicsForm form){
        BundleViewAllComics result = new BundleViewAllComics();
        UserModel theUser = userRepository.findBytoken(form.getToken());
        if (theUser == null || !theUser.getUsername().equals(form.getComicOwnerName())) {
            result.setResult("tokenerror");
            return result;
        }

        ArrayList<ArrayList<String>> sharedComs = theUser.getSharedComics();
        for(ArrayList<String> list : sharedComs){
            UserModel findUser = userRepository.findByusername(list.get(0)); //get user that gave permission
            if(findUser != null){
                ArrayList<ComicModel> coms = comicRepository.findByUserID(findUser.getId());
                for(ComicModel temp : coms){
                    if(temp.getName().equals(list.get(1)) && temp.getUsername().equals(list.get(0))){ //get the right comic
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                        ComicSeriesModel series = ComicSeriesRepository.findByid(temp.getComicSeriesID());
                        pans.setComicSeriesName(series.getName());
                        pans.setComicID(temp.getId());
                        pans.setComicName(temp.getName());
                        pans.setDate(temp.getDate());
                        pans.setUsername(temp.getUsername() );
                        for(int i=0; i<temp.getPanelsList().size(); i++){
                            PanelModel real = panelRepository.findByid(temp.getPanelsList().get(i));
                            pans.getComicList().add(real);
                        }
                        result.getBundleComicList().add(pans);
                    }
                }
            }
        }
        result.setResult("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/search", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public SearchResult search(@RequestBody SearchForm form){
        SearchResult result = new SearchResult();
        UserModel user = userRepository.findBytoken(form.getToken());
        // If credentials invalid, don't send any data
        if (user == null || !user.getUsername().equals(form.getUsername())) {
            return result;
        }
        //search all 3 to see if any username, comic anme, or series name match search query
        List<UserModel> allUsers = userRepository.findAll();
        ArrayList<UserModel> matchedUsers = new ArrayList<>();
        for(UserModel u: allUsers){
            if(u.getUsername2().contains(form.getQuery().toLowerCase()) || form.getQuery().toLowerCase().contains(u.getUsername2())){
                matchedUsers.add(u);
            }
        }
        List<ComicSeriesModel> allseries = ComicSeriesRepository.findAll();
        ArrayList<ComicSeriesModel> matchedSeries = new ArrayList<>();
        ArrayList<String> seriesOwners = new ArrayList<>();
        for( ComicSeriesModel c : allseries){
            if(c.getName2().contains(form.getQuery().toLowerCase()) || form.getQuery().toLowerCase().contains(c.getName2())){
                // Check permissions
                if (c.getUserID().equals(user.getId()) || c.getPrivacy().equals("Public") || c.getSharedWith().contains(user.getUsername())) {
                    matchedSeries.add(c);
                    seriesOwners.add(userRepository.findByid(c.getUserID()).getUsername());
                }
            }
        }
        List<ComicModel> allComics = comicRepository.findAll();
        //ArrayList<ComicModel> matchedComics = new ArrayList<>();
        ArrayList<ViewAllComicsResult> allComicsFormatted = new ArrayList<>();
        for(ComicModel x: allComics){
            if(x.getName2().contains(form.getQuery().toLowerCase()) || form.getQuery().toLowerCase().contains(x.getName2())){
                if (x.getUserID().equals(user.getId()) || x.getPrivacy().equals("Public") || x.getSharedWith().contains(user.getUsername())) {
                    //matchedComics.add(x);
                    ViewAllComicsResult res = new ViewAllComicsResult();
                    ComicSeriesModel tempSeries = ComicSeriesRepository.findByid(x.getComicSeriesID());
                    res.setComicSeriesName(tempSeries.getName());
                    res.setComicName(x.getName());
                    res.setComicID(x.getId());
                    res.setUsername(x.getUsername());
                    res.setDate(x.getDate());
                    allComicsFormatted.add(res);
                }
            }
        }
        result.setUsers(matchedUsers);
        result.setAll_series(matchedSeries);
        result.setSeriesOwners(seriesOwners);
        result.setAll_comics(allComicsFormatted);
        return result;
    }

    //The "my" use cases are bellow

    //View Own Comic Series
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/view/series", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewMySeriesResult viewMySeries(@RequestBody ViewMySeriesForm form){
        ViewMySeriesResult result = new ViewMySeriesResult();
        UserModel user = userRepository.findBytoken(form.getToken());
        if (user == null || !user.getUsername().equals(form.getUsername())) {
            result.setResult("tokenerror");
            return result;
        } else{
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

        UserModel user = userRepository.findBytoken(form.getUsername());
        if(user == null) {
            return result;
        } else {
            ArrayList<String> temp = user.getSubscriptions();
            for(String str : temp){
                if(str.equals(form.getSub())){ //already subbed to this user
                    result.setResult("error");
                    return result;
                }
            }
            user.getSubscriptions().add(form.getSub());
            userRepository.save(user);
            result.setResult("success");
        }
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/unsubscribe", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public UnSubscriptionResult unsubscribe(@RequestBody UnSubscriptionForm form){
        UnSubscriptionResult result = new UnSubscriptionResult();
        UserModel user = userRepository.findBytoken(form.getUsername());
        System.out.println("user.. "+ form.getUsername());
        System.out.println("to unsub.. " + form.getUnSub());
        if(user == null) {
            return result;
        } else {
            ArrayList<String> temp = user.getSubscriptions();
            for(String str : temp){
                System.out.println(str);
                if(str.equals(form.getUnSub())){ 
                    temp.remove(str);
                    user.setSubscriptions(temp);
                    userRepository.save(user);
                    result.setResult("success");
                    return result;
                }
            }
            result.setResult("error"); //tryna unsub to someone they're not subbed to
        }
        return result;
    }

    //View Subscriptions (list of subscriptions of a user -> not same as the subscriptions section of homepage)
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/subscriptions", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ViewSubscriptionsResult viewSubscriptions(@RequestBody ViewSubscriptionsForm form){
        ViewSubscriptionsResult result = new ViewSubscriptionsResult();
        UserModel user = userRepository.findBytoken(form.getUsername());
        if(user==null){
            return result;
        }
        for(String subscriptionsid : user.getSubscriptions()){
            result.getSeries().add(ComicSeriesRepository.findByid(subscriptionsid));
        }
        return result;
    }

    //SIDEBAR RECOMMENDATIONS   Recommendations are returned based on same user of the comic in question or same genre.
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/sidebar", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics sidebar (@RequestBody SideBarForm form){
        BundleViewAllComics result = new BundleViewAllComics();

        UserModel user = userRepository.findBytoken(form.getToken());
        ComicModel viewedComic = comicRepository.findByid(form.getViewedComicID());
        if(user == null || !user.getUsername().equals(form.getViewerName())){
            result.setResult("tokenerror");
            return result;
        }
        if(viewedComic == null){
            result.setResult("Comic does not exists");
            return result;
        }

        int suggestions_Found = 0;

        List<ComicModel> findComicList = comicRepository.findAll();
        if(findComicList!=null){
            //check for comics of same author
            for(ComicModel comic : findComicList){
                if(comic.getPrivacy().equals("Public") || comic.getSharedWith().contains(user.getUsername())){
                //max of 3 suggestions for comics from same as the viewed comic
                    if(suggestions_Found == 3)
                        break;
                    if(comic.getUserID().equals(viewedComic.getUserID()) && !(comic.getId().equals(viewedComic.getId()))){
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                                ComicSeriesModel series = ComicSeriesRepository.findByid(comic.getComicSeriesID());
                                pans.setComicSeriesName(series.getName());
                                pans.setComicName(comic.getName());
                                pans.setComicID(comic.getId());
                                pans.setUsername(comic.getUsername());
                                pans.setDate(comic.getDate());
                                for(int k=0; k<comic.getPanelsList().size(); k++){
                                    PanelModel real = panelRepository.findByid(comic.getPanelsList().get(k));
                                    pans.getComicList().add(real);
                                }
                                result.getBundleComicList().add(pans);
                                suggestions_Found +=1;
                    }
                }
            }
            //now by genres (last 2 or up to 5)
            ComicSeriesModel currentSeries = ComicSeriesRepository.findByid(viewedComic.getComicSeriesID());
            ArrayList<String> currentGenres = currentSeries.getGenre();
            for(ComicModel comic: findComicList){
                if(comic.getPrivacy().equals("Public") || comic.getSharedWith().contains(user.getUsername())){
                    if(suggestions_Found == 5)
                        break;
                    if(viewedComic.getId().equals(comic.getId()))
                        continue;
                    ComicSeriesModel tempSeries = ComicSeriesRepository.findByid(comic.getComicSeriesID());
                    ArrayList<String> tempGenres = tempSeries.getGenre();
                    boolean genreInCommon = false;
                    for(String g : currentGenres){
                        for (String g2: tempGenres){
                            if (g.equals(g2)){
                                genreInCommon = true;
                            }
                        }
                    }
                    if(genreInCommon){
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                                ComicSeriesModel series = ComicSeriesRepository.findByid(comic.getComicSeriesID());
                                pans.setComicSeriesName(series.getName());
                                pans.setComicName(comic.getName());
                                pans.setComicID(comic.getId());
                                pans.setUsername(comic.getUsername());
                                pans.setDate(comic.getDate());
                                for(int k=0; k<comic.getPanelsList().size(); k++){
                                    PanelModel real = panelRepository.findByid(comic.getPanelsList().get(k));
                                    pans.getComicList().add(real);
                                }
                                result.getBundleComicList().add(pans);
                                suggestions_Found +=1;
                    }
                }
            }
            //now if there aren't 5 of those two above, we get rest from recents.

            for(int i=0; i<findComicList.size(); i++){
                if(suggestions_Found == 5)
                    break;
                ComicModel temp = findComicList.get(i);
                // Should not be your comic
                if (!temp.getUsername().equals(user.getUsername())) {
                    // Check permissions
                    if (temp.getPrivacy().equals("Public") || temp.getSharedWith().contains(user.getUsername())) {
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                        ComicSeriesModel series = ComicSeriesRepository.findByid(temp.getComicSeriesID());
                        pans.setComicSeriesName(series.getName());
                        pans.setComicName(temp.getName());
                        pans.setComicID(temp.getId());
                        pans.setUsername(temp.getUsername());
                        pans.setDate(temp.getDate());
                        PanelModel firstPanel = panelRepository.findByid(temp.getPanelsList().get(0));
                        pans.getComicList().add(firstPanel);
                        result.getBundleComicList().add(pans);
                        suggestions_Found +=1;
                    }
                }
            }

        }
        else{
            result.setResult("No Comics Found");
        }
        
        return result;
    }
    

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/welcomefavorites", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics favorites(@RequestBody ViewAllComicsForm form){
        BundleViewAllComics result = new BundleViewAllComics();

        //find user
        UserModel user = userRepository.findBytoken(form.getToken());
        if(user == null || !user.getUsername().equals(form.getComicOwnerName())){
            result.setResult("tokenerror");
            return result;
        }
        
        ArrayList<String> favs = user.getFavorites();
        if(favs.size() != 0){
            for(String id: favs){
                ViewAllComicsResult pans = new ViewAllComicsResult();
                ComicModel com = comicRepository.findByid(id);
                pans.setComicID(com.getId());
                pans.setComicName(com.getName());
                pans.setDate(com.getDate());
                pans.setUsername(com.getUsername());
                ArrayList<String> panIds = com.getPanelsList();
                for(String pnID: panIds){
                    PanelModel panel = panelRepository.findByid(pnID);
                    pans.getComicList().add(panel);
                }
                result.getBundleComicList().add(pans);
            }
        }/*
        else{
            result.setResult("No Comics Found");
            return result;
        }*/
        result.setResult("success");
        return result;

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/welcomerecent", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics recent(@RequestBody ViewAllComicsForm form){
        BundleViewAllComics result = new BundleViewAllComics();
        UserModel user = userRepository.findBytoken(form.getToken());
        // Check if token is valid
        if (user == null || !user.getUsername().equals(form.getComicOwnerName())) {
            result.setResult("tokenerror");
            return result;
        }
        List<ComicModel> findComicList = comicRepository.findAll();
        if(findComicList != null){
            for(int i=0; i<findComicList.size(); i++){
                ComicModel temp = findComicList.get(i);
                // Should not be your comic
                if (!temp.getUsername().equals(user.getUsername())) {
                    // Check permissions
                    if (temp.getPrivacy().equals("Public") || temp.getSharedWith().contains(user.getUsername())) {
                        ViewAllComicsResult pans = new ViewAllComicsResult();
                        ComicSeriesModel series = ComicSeriesRepository.findByid(temp.getComicSeriesID());
                        pans.setComicSeriesName(series.getName());
                        pans.setComicName(temp.getName());
                        pans.setComicID(temp.getId());
                        pans.setUsername(temp.getUsername());
                        pans.setDate(temp.getDate());
                        PanelModel firstPanel = panelRepository.findByid(temp.getPanelsList().get(0));
                        pans.getComicList().add(firstPanel);
                        result.getBundleComicList().add(pans);
                    }
                }
            }
            // Sort the comic list
            ArrayList<ViewAllComicsResult> comicList = result.getBundleComicList();
            SimpleDateFormat format = new SimpleDateFormat("EEE LLL dd HH:mm:ss z yyyy");
            Collections.sort(comicList, (ViewAllComicsResult comic1, ViewAllComicsResult comic2) -> {
                try {
                    return format.parse(comic2.getDate()).compareTo(format.parse(comic1.getDate()));
                } catch (ParseException e) {
                        System.out.println("Error parsing date for welcomerecent");
                        throw new IllegalArgumentException(e);
                }
            });
            System.out.println("Sorted comics, recents should be first");
            for (ViewAllComicsResult c : result.getBundleComicList()) {
                System.out.println(c);
            }
            System.out.println("~~~~~~~~~~~~~~");
        }
        result.setResult("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/welcomesubscriptions", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public BundleViewAllComics welcomeSubscriptions(@RequestBody ViewAllComicsForm form) {
        BundleViewAllComics result = new BundleViewAllComics();
        UserModel user = userRepository.findBytoken(form.getToken());
        // Check if token is valid
        if (user == null || !user.getUsername().equals(form.getComicOwnerName())) {
            result.setResult("tokenerror");
            return result;
        }
        ArrayList<String> subs = user.getSubscriptions();
        List<ComicModel> findComicList = comicRepository.findAll();
        for (ComicModel comic : findComicList) {
            // Check if comic author is subscribed to
            if (subs.contains(comic.getUsername())) {
                // Check permissions
                if (user.getId().equals(comic.getUserID()) || comic.getPrivacy().equals("Public") || comic.getSharedWith().contains(user.getUsername())) {
                    ViewAllComicsResult pans = new ViewAllComicsResult();
                    ComicSeriesModel series = ComicSeriesRepository.findByid(comic.getComicSeriesID());
                    pans.setComicSeriesName(series.getName());
                    pans.setComicName(comic.getName());
                    pans.setComicID(comic.getId());
                    pans.setUsername(comic.getUsername());
                    pans.setDate(comic.getDate());
                    // Get only the first panel to display
                    PanelModel firstPanel = panelRepository.findByid(comic.getPanelsList().get(0));
                    pans.getComicList().add(firstPanel);
                    result.getBundleComicList().add(pans);
                }
            }
        }
        SimpleDateFormat format = new SimpleDateFormat("EEE LLL dd HH:mm:ss z yyyy");
        Collections.sort(result.getBundleComicList(), (ViewAllComicsResult comic1, ViewAllComicsResult comic2) -> {
            try {
                return format.parse(comic2.getDate()).compareTo(format.parse(comic1.getDate()));
            } catch (ParseException e) {
                    System.out.println("Error parsing date for welcomesubscriptions");
                    throw new IllegalArgumentException(e);
            }
        });
        System.out.println("Sorted comics, recents should be first");
        for (ViewAllComicsResult c : result.getBundleComicList()) {
            System.out.println(c);
        }
        System.out.println("~~~~~~~~~~~~~~");
        result.setResult("success");
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

    //Rate Comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/comic/rate", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RateComicResult RateComic(@RequestBody RateComicForm form){
        RateComicResult result = new RateComicResult();
        ComicModel comic = comicRepository.findByid(form.getComicID());
        UserModel user = userRepository.findBytoken(form.getToken());
        if(!user.getToken().equals(form.getToken())){
            result.setResult("invalid token");
            return result;
        }
        if (comic != null && user != null) {
            List<RatingModel> temp= ratingRepository.findAll();
            for(Iterator<RatingModel> it = temp.iterator(); it.hasNext();){
                RatingModel item = it.next();
                if(item.getUserID().equals(userRepository.findByusername(form.getUsername()).getId())
                && item.getComicID().equals(form.getComicID())){
                    ratingRepository.delete(item); //delete existing to replace
                }
            }
            RatingModel newRating = new RatingModel(user.getId(), form.getRating(), comic.getId());
            ratingRepository.save(newRating);
            ArrayList<String> favs = user.getFavorites();
            if(favs.size() != 0){
                if(user.getFavorites().contains(form.getComicID()) && form.getRating()== -1){
                    user.getFavorites().remove(form.getComicID()); //un liking it
                    userRepository.save(user); 
                }
                else if(!user.getFavorites().contains(form.getComicID()) && form.getRating()==1){
                    user.getFavorites().add(form.getComicID()); // liking it
                    userRepository.save(user);
                } 
            }
            else{
                user.getFavorites().add(form.getComicID());
                userRepository.save(user);
            }
            result.setResult("success");
        }
        return result;
    }

    //Get aggregate ratings for A comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/comic/rate/getRating", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public GetRatingResult getRatingComic(@RequestBody GetRatingForm form){
        GetRatingResult result = new GetRatingResult();
        List<RatingModel> comic = ratingRepository.findBycomicID(form.getComicID());
        if (comic.size() != 0) {
            int totalRating = 0;
            for(RatingModel item: comic){
                totalRating += item.getRating();
            }
            result.setResult(totalRating);
            return result;
        }
        result.setResult(0);
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/delete-report", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public DeleteReportResult deleteReport(@RequestBody DeleteReportForm form){
        DeleteReportResult res = new DeleteReportResult();
        if(form.getType().equals("user")){
            List<ReportedUsersModel> reports = reportedUsersRepo.findAll();
            boolean delete = false;
            for(ReportedUsersModel report: reports){
                if(report.getReportedUserID().equals(form.getReportedID())){
                    reportedUsersRepo.delete(report);
                }
                delete = true;
            }
            if(!delete){
                res.setStatus("Could not find user with given id");
            }
        }
        else if(form.getType().equals("comic")){
            List<ReportedComicsModel> reports = reportedComicsRepo.findAll();
            boolean delete = false;
            for(ReportedComicsModel report: reports){
                if(report.getComicID().equals(form.getReportedID())){
                    reportedComicsRepo.delete(report);
                }
                delete = true;
            }
            if(!delete){
                res.setStatus("Could not find comic with given id");
            }
        }
        else if(form.getType().equals("series")){
            List<ReportedSeriesModel> reports = reportedSeriesRepo.findAll();
            boolean delete = false;
            for(ReportedSeriesModel report: reports){
                if(report.getSeriesID().equals(form.getReportedID())){
                    reportedSeriesRepo.delete(report);
                }
                delete = true;
            }
            if(!delete){
                res.setStatus("Could not find series with given id");
            }
        }
        else if((form.getType().equals("comment"))){
            List<ReportedCommentsModel> reports = reportedCommentsRepo.findAll();
            boolean delete = false;
            for(ReportedCommentsModel report: reports){
                if(report.getCommentID().equals(form.getReportedID())){
                    reportedCommentsRepo.delete(report);
                }
                delete = true;
            }
            if(!delete){
                res.setStatus("Could not find comment with given id");
            }
        }
        else{
            res.setStatus("error");
        }
        return res;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/report", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ReportResult report(@RequestBody ReportForm form){
        ReportResult result = new ReportResult();
        if(form.getType().equals("user")){
            List<ReportedUsersModel> temp = reportedUsersRepo.findByuserID(form.getReportingID());
            for(ReportedUsersModel x: temp){
                if(x.getUserID().equals(form.getReportingID()) && x.getReportedUserID().equals(form.getReportedID())){
                    result.setStatus("you already reported this user");
                    return result;
                } 
            } 
            ReportedUsersModel newReport = new ReportedUsersModel(form.getReportingID(), form.getReportedID(), form.getReason());
            reportedUsersRepo.save(newReport);
        }
        else if(form.getType().equals("comic")){
            List<ReportedComicsModel> temp = reportedComicsRepo.findByuserID(form.getReportingID());
            for(ReportedComicsModel x: temp){
                if(x.getUserID().equals(form.getReportingID()) && x.getComicID().equals(form.getReportedID())){
                    result.setStatus("you already reported this comic");
                    return result;
                }
            }
            ReportedComicsModel newReport = new ReportedComicsModel(form.getReportedID(), form.getReportingID(), form.getReason());
            reportedComicsRepo.save(newReport);
        }
        else if(form.getType().equals("series")){
            List<ReportedSeriesModel> temp= reportedSeriesRepo.findByuserID(form.getReportingID());
            for(ReportedSeriesModel x: temp){
                if(x.getUserID().equals(form.getReportingID()) && x.getSeriesID().equals(form.getReportedID())){
                    result.setStatus("you already reported this series");
                    return result;
                }
            }
            ReportedSeriesModel newReport = new ReportedSeriesModel(form.getReportedID(), form.getReportingID(), form.getReason());
            reportedSeriesRepo.save(newReport);
        }
        else if(form.getType().equals("comment")){
            List<ReportedCommentsModel> temp = reportedCommentsRepo.findByuserID(form.getReportingID());
            for(ReportedCommentsModel x: temp){
                if(x.getUserID().equals(form.getReportingID()) && x.getCommentID().equals(form.getReportedID())){
                    result.setStatus("you already reported this comment");
                    return result;
                }
            }
            ReportedCommentsModel newReport = new ReportedCommentsModel(form.getReportedID(), form.getReportingID(), form.getReason());
            reportedCommentsRepo.save(newReport);
        }
        result.setStatus("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/deactivate", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public DeactivateResult deactivate(@RequestBody Deactivate form){
        DeactivateResult result = new DeactivateResult();
        UserModel temp = userRepository.findByid(form.getUserID());
        temp.setActive(false); //deactivate
        userRepository.save(temp);
        List<ReportedUsersModel> badBoi = reportedUsersRepo.findByreportedUserID(form.getUserID()); 
        if(badBoi.size() == 0){
            result.setStatus("user doesn't exist");
            return result;
        }
        //remove all instances of deactivated user reports from reported users collections
        for(ReportedUsersModel x: badBoi){
            reportedUsersRepo.delete(x);
        }
        result.setStatus("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/adminRemoveComic", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RemoveResult removeComic(@RequestBody RemoveForm form){
        RemoveResult result = new RemoveResult();
        ComicModel toDel = comicRepository.findByid(form.getId());
        if(toDel == null){
            result.setStatus("err");
            return result;
        }
        ComicSeriesModel series = ComicSeriesRepository.findByid(toDel.getComicSeriesID());
        series.getComics().remove(form.getId());
        ComicSeriesRepository.save(series);
        comicRepository.delete(toDel);

        List<UserModel> all = userRepository.findAll();
        for(UserModel us: all){
            if(us.getFavorites().contains(toDel.getId())){
                us.getFavorites().remove(toDel.getId());
                userRepository.save(us);
            }
        }

        List<ReportedComicsModel> temp = reportedComicsRepo.findBycomicID(form.getId());
        if(temp.size() == 0){
            result.setStatus("comics don't exist");
            return result;
        }
        for(ReportedComicsModel x : temp){
            reportedComicsRepo.delete(x);
        }
        result.setStatus("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/adminRemoveSeries", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RemoveResult removeSeries(@RequestBody RemoveForm form){
        RemoveResult result = new RemoveResult();
        ComicSeriesModel toDel = ComicSeriesRepository.findByid(form.getId());
        if(toDel == null){
            result.setStatus("err");
            return result;
        }
        for(String comicID: toDel.getComics()){
            ComicModel toDelComic = comicRepository.findByid(comicID);
            comicRepository.delete(toDelComic);
        }
        ComicSeriesRepository.delete(toDel);
        List<ReportedSeriesModel> temp = reportedSeriesRepo.findByseriesID(form.getId());
        if(temp.size() == 0){
            result.setStatus("series don't exist");
            return result;
        }
        for(ReportedSeriesModel x : temp){
            reportedSeriesRepo.delete(x);
        }
        result.setStatus("success");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/adminRemoveComment", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RemoveResult removeComment(@RequestBody RemoveForm form){
        RemoveResult result = new RemoveResult();
        List<ReportedCommentsModel> temp = reportedCommentsRepo.findBycommentID(form.getId());
        if(temp.size() == 0){
            result.setStatus("comments don't exist");
            return result;
        }
        CommentModel toDel = commentRepository.findByid(form.getId());
        ComicModel delCom = comicRepository.findByid(toDel.getComicID());
        delCom.getCommentsList().remove(form.getId()); //delete to comment from the comic's comment list
        comicRepository.save(delCom);
        commentRepository.delete(toDel); //delete the comment
        for(ReportedCommentsModel x : temp){ //delete instances of that comment bc it's already delete in comment model
            reportedCommentsRepo.delete(x);
        }
        result.setStatus("success");
        return result;
    }


    /*
        * goes through each of the reported models
        * gets the id of whatever that was reported and the # of times it was reported
    */
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/adminData", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public AdminDataResult getAdminData(@RequestBody AdminDataForm form){
        AdminDataResult result = new AdminDataResult();
        // Check for validity of token
        UserModel admin = userRepository.findBytoken(form.getToken());
        if (admin == null || !form.getUsername().equals("admin") || !admin.getUsername().equals("admin")) {
            result.setResult("tokenerror");
            return result;
        }

        HashMap<String, Integer> allUserData = new HashMap<>();
        List<ReportedUsersModel> allUsers = reportedUsersRepo.findAll();
        for(ReportedUsersModel x: allUsers){
            if(allUserData.containsKey(x.getReportedUserID())){
                allUserData.put(x.getReportedUserID(), allUserData.get(x.getReportedUserID())+1); //update frequency if present
            }
            else{
                allUserData.put(x.getReportedUserID(), 1);
            }
        }

        ArrayList<UserModel> userConent = new ArrayList<>(); //actual content for admin
        for(String key: allUserData.keySet()){
            UserModel badUser = userRepository.findByid(key);
            userConent.add(badUser);
        }

        HashMap<String, Integer> allSeriesData = new HashMap<>();
        List<ReportedSeriesModel> allSeries = reportedSeriesRepo.findAll();
        for(ReportedSeriesModel x: allSeries){
            if(allSeriesData.containsKey(x.getSeriesID())){
                allSeriesData.put(x.getSeriesID(), allSeriesData.get(x.getSeriesID())+1); //update frequency if present
            }
            else{
                allSeriesData.put(x.getSeriesID(), 1);
            }
        }

        ArrayList<ComicSeriesModel> seriesContent = new ArrayList<>();
        ArrayList<String> owners = new ArrayList<>();
        for(String key: allSeriesData.keySet()){
            ComicSeriesModel badSeries = ComicSeriesRepository.findByid(key);
            seriesContent.add(badSeries);
            UserModel seriesOwner = userRepository.findByid(badSeries.getUserID());
            owners.add(seriesOwner.getUsername()); 
        }

        HashMap<String, Integer> allComicsData = new HashMap<>();
        List<ReportedComicsModel> allComics = reportedComicsRepo.findAll();
        for(ReportedComicsModel x: allComics){
            if(allComicsData.containsKey(x.getComicID())){
                allComicsData.put(x.getComicID(), allComicsData.get(x.getComicID())+1); //update frequency if present
            }
            else{
                allComicsData.put(x.getComicID(), 1);
            }
        }

        ArrayList<ComicModel> comicContent = new ArrayList<>();
        for(String key: allComicsData.keySet()){
            ComicModel badComic = comicRepository.findByid(key);
            comicContent.add(badComic);
        }


        HashMap<String, Integer> allCommentsData = new HashMap<>();
        List<ReportedCommentsModel> allComents = reportedCommentsRepo.findAll();
        for(ReportedCommentsModel x: allComents){
            if(allCommentsData.containsKey(x.getCommentID())){
                allCommentsData.put(x.getCommentID(), allCommentsData.get(x.getCommentID())+1); //update frequency if present
            }
            else{
                allCommentsData.put(x.getCommentID(), 1);
            }
        }

        ArrayList<CommentModel> commentContent = new ArrayList<>();
        for(String key: allCommentsData.keySet()){
            CommentModel badCommment = commentRepository.findByid(key);
            commentContent.add(badCommment);
        }


        result.setUsers(allUserData);
        result.setSeries(allSeriesData);
        result.setComics(allComicsData);
        result.setComments(allCommentsData);
        result.setUserContent(userConent);
        result.setSeriesContent(seriesContent);
        result.setComicConent(comicContent);
        result.setCommentContent(commentContent);
        result.setSeriesOwners(owners);
        result.setResult("success");
        return result;
    }

    //Comment on Comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/comment", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public CommentResult comment(@RequestBody CommentForm form) {
        CommentResult result = new CommentResult();
        UserModel owner = userRepository.findByusername(form.getComicOwner());
        UserModel commenter = userRepository.findBytoken(form.getCommenterName());
        // Get the series
        ArrayList<ComicSeriesModel> findComicSeriesList = ComicSeriesRepository.findByname(form.getSeriesName());
        ComicSeriesModel inSeries = null;
        for (ComicSeriesModel x : findComicSeriesList) {
            if (x.getUserID().equals(owner.getId())) {
                inSeries = x;
                break;
            }
        }  
        if (inSeries == null) {
            result.setStatus("failure");
            return result;
        }
        // Get the comic
        ComicModel targetComic = null;
        ArrayList<ComicModel> userComics = comicRepository.findByUserID(owner.getId());
        for (ComicModel comic : userComics) {
            if (comic.getName().equals(form.getComicName()) && comic.getComicSeriesID().equals(inSeries.getId())) {
                targetComic = comic;
                break;
            }
        }
        if (targetComic == null) {
            result.setStatus("failure");
            return result;
        }
        CommentModel newComment = new CommentModel(commenter.getId(), commenter.getUsername(), form.getContent(), (new Date()).toString());
        newComment.setComicID(targetComic.getId());
        // Save the comment and add it to the list of comments on the comic
        commentRepository.save(newComment);
        ArrayList<String> commentsList = targetComic.getCommentsList();
        commentsList.add(newComment.getId());
        comicRepository.save(targetComic);

        result.setStatus("success");
        return result;
    }

    // Get comments for a comic
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/getComments", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public GetCommentsResult getComments(@RequestBody GetCommentsForm form) {
        GetCommentsResult result = new GetCommentsResult();
        UserModel owner = userRepository.findByusername(form.getComicOwner());
        ComicModel targetComic = null;
        ArrayList<ComicModel> userComics = comicRepository.findByUserID(owner.getId());
        for (ComicModel comic : userComics) {
            if (comic.getName().equals(form.getComicName())) {
                targetComic = comic;
                break;
            }
        }
        if (targetComic == null) {
            result.setStatus("failure");
            return result;
        }
        // Get all the comments
        ArrayList<CommentModel> comments = new ArrayList<>();
        for (String commentId : targetComic.getCommentsList()) {
            CommentModel comment = commentRepository.findByid(commentId);
            if (comment != null) {
                comments.add(comment);
            }
        }
        result.setStatus("success");
        result.setComments(comments);
        return result;
    }

    // Delete a comment by ID
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/delete/comment", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public DeleteCommentResult deleteComment(@RequestBody DeleteCommentForm form) {
        DeleteCommentResult result = new DeleteCommentResult();
        CommentModel comment = commentRepository.findByid(form.getCommentID());
        ComicModel comic = comicRepository.findByid(form.getComicID());
        // Delete the reference in the comic
        ArrayList<String> commentsList = comic.getCommentsList();
        commentsList.remove(form.getCommentID());
        comicRepository.save(comic);
        // Delete the comment
        commentRepository.delete(comment);
        result.setStatus("success");
        return result;
    }


}