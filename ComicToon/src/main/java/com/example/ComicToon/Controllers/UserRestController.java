package com.example.ComicToon.Controllers;

import com.example.ComicToon.Models.*;
import com.example.ComicToon.Models.ModelRepositories.*;
import com.example.ComicToon.Models.RequestResponseModels.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.mail.internet.MimeMessage;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@RestController
public class UserRestController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender sender;

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/register", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RegistrationLoginResult register(@RequestBody RegistrationForm form){
        RegistrationLoginResult result = new RegistrationLoginResult();

        if(userRepository.findByusername(form.getUsername()) == null && userRepository.findByemail(form.getEmail())==null){
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String pw_hash = passwordEncoder.encode(form.getPassword());
            UserModel user = new UserModel(form.getEmail(),form.getUsername(), pw_hash, "Regular");
            userRepository.save(user);
            UserModel newUser = userRepository.findByusername(user.getUsername());
            // result.setStatus("success");
            result.setUsername(newUser.getUsername());
            result.setToken(newUser.getToken());
            result.setId(newUser.getId());
            // Send verification email
            try{
                MimeMessage message = sender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message);
                helper.setTo(form.getEmail());
                helper.setText("Your verification key is: " + user.getVerificationKey());
                helper.setSubject("ComicToon Verify Account");
                sender.send(message);
                result.setStatus("success");
            } catch(Exception e){
                System.out.println(e.getStackTrace().toString());
                result.setStatus("Error in sending email");
            }
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
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if(findUser !=null){
            // Check if verified
            if(!passwordEncoder.matches(form.getPassword(), findUser.getPassword())){
                result.setStatus("Incorrect Login Details");
                result.setUsername("");
            } else if (!findUser.getVerified()) {
                result.setStatus("User is not verified!");
                return result;
            } else if(passwordEncoder.matches(form.getPassword(), findUser.getPassword())){
                result.setStatus("success");
                result.setUsername(findUser.getUsername());
                result.setUsername(findUser.getUsername());
                result.setToken(findUser.getToken());
                result.setId(findUser.getId());
                result.setActive(findUser.getActive());
            }
        }
        else{
            result.setStatus("Incorrect Login Details");
            result.setUsername("");
        }
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/forgot", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ForgotResult forgot(@RequestBody ForgotForm form){
        ForgotResult result = new ForgotResult();
        UserModel findUser = userRepository.findByemail(form.getEmail());
        if(findUser!= null){
            try{
                MimeMessage message = sender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message);
                helper.setTo(findUser.getEmail());
                helper.setText("Your password reset code is: " + findUser.getKey());
                helper.setSubject("ComicToon Forgot Password Reset");
                sender.send(message);
                result.setResult("Success");
                result.setKey(findUser.getKey());
            }catch(Exception e){
                result.setResult("Error in sending email");
            }
        }
        else{
            result.setResult("Email does not exists");
        }
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/forgotVerification", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ForgotVerificationResult forgotVerification(@RequestBody ForgotVerificationForm form){
        ForgotVerificationResult result = new ForgotVerificationResult();
        List<UserModel> users = userRepository.findAll();
        UserModel userWithKey = null;
        for (UserModel user:users){
            if (user.getKey().equals(form.getKey())){
                userWithKey = user;
            }
        }
        if (userWithKey!= null){
            result.setResult("success");
            return result;
        }

        result.setResult("failure");
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/forgotChangePassword", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public ChangePasswordResult forgotChangePassword(@RequestBody ChangePasswordForm form){
        ChangePasswordResult result = new ChangePasswordResult();

        UserModel findUser = userRepository.findByusername(form.getUsername());
        if(findUser!=null && findUser.getKey().equals(form.getKey())){
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String pw_hash = passwordEncoder.encode(form.getPassword());
            //findUser.setPassword(form.getPassword());
            findUser.setPassword(pw_hash);
            findUser.setKey(UUID.randomUUID().toString());
            userRepository.save(findUser);
            result.setResult("success");
        } else if (findUser == null) {
            result.setResult("Invalid username");
        } else{
            result.setResult("Invalid key");
        }

        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/verifyAccount", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public VerifyAccountResult verifyAccount(@RequestBody VerifyAccountForm form) {
        VerifyAccountResult result = new VerifyAccountResult();
        UserModel findUser = userRepository.findByemail(form.getEmail());
        if (findUser != null) {
            String verificationKey = findUser.getVerificationKey();
            if (verificationKey.equals(form.getKey())) {
                findUser.setVerified(true);
                userRepository.save(findUser);
                result.setResult("success");
            } else {
                result.setResult("Invalid verification key");
            }
        } else {
            result.setResult("Email does not exist");
        }
        return result;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/checkToken", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public VerifyAccountResult checkToken(@RequestBody CheckTokenForm form) {
        VerifyAccountResult result = new VerifyAccountResult();
        UserModel user = userRepository.findBytoken(form.getToken());
        if (user == null || !user.getUsername().equals(form.getUsername())) {
            result.setResult("tokenerror");
        } else {
            result.setResult("success");
        }
        return result;
    }


    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
        authList.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authList;
    }




}