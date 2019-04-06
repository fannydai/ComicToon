package com.example.ComicToon.Controllers;

import com.example.ComicToon.Models.*;
import com.example.ComicToon.Models.ModelRepositories.*;
import com.example.ComicToon.Models.RequestResponseModels.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/register", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RegistrationLoginResult register(@RequestBody RegistrationForm form){
        RegistrationLoginResult result = new RegistrationLoginResult();

        if(userRepository.findByusername(form.getUsername()) == null && userRepository.findByemail(form.getEmail())==null){
            UserModel user = new UserModel(form.getEmail(),form.getUsername(), form.getPassword(),"Regular");
            userRepository.save(user);
            result.setStatus("success");
            result.setUsername(user.getUsername());
        }
        else if(userRepository.findByusername(form.getUsername()) == null && userRepository.findByemail(form.getEmail())!=null){
            result.setStatus("Email Already Exists");
            result.setUsername("");
        }

        else if(userRepository.findByusername(form.getUsername()) != null && userRepository.findByemail(form.getEmail())==null){
            result.setStatus("Username Already Exists");
            result.setUsername("");
        }
        else{
            result.setStatus("Username and Email Already Exists");
            result.setUsername("");
        }

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/login", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RegistrationLoginResult login(@RequestBody LoginForm form){
        RegistrationLoginResult result = new RegistrationLoginResult();
        
        UserModel findUser = userRepository.findByemail(form.getEmail());
        if(findUser !=null){
            if(findUser.getPassword().equals(form.getPassword())){
                result.setStatus("success");
                result.setUsername(findUser.getUsername());
            }
            else{
                result.setStatus("Incorrect Login Details");
                result.setUsername("");
            }
        }
        else{
            result.setStatus("Incorrect Login Details");
            result.setUsername("");
        }
        return result;
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    // @RequestMapping(value = "/forgot", method = RequestMethod.POST, consumes = {"application/json"})
    // @ResponseBody

    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
        authList.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authList;
    }




}