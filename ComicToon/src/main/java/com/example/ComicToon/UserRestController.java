/** 
 * ENDPOINTS
 * 
 * /login
 * /register
 * /verify
 * /resetPassword
 * @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
 * 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import main.java.com.example.ComicToon.Models.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserRestController {
    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }

    /**
     * Controller for registration form POST
     * Enforces unique username requirement -- pasword requirements should be enforced on the front-end.
     * Input: RequestBody (JSON) mapping to RegistrationForm (Class)
     * Output: ResponseBody (JSON) Parameters: 'status': 'success' or 'failure', 'username' : logged in user's username
     */
    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/register", method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RegistrationLoginResult register(@RequestBody RegistrationLoginForm regform) {
        RegistrationLoginResult res = new RegistrationLoginResult();
        
        if(userRepository.findByusername(regform.getUsername()) == null) {
            UserModel user = new UserModel(regform.getUsername(), regform.getPassword());
            userRepository.save(user);
            res.setStatus("success");
            res.setUsername(user.getUsername());
        } else {
            // user with username already exists
            res.setStatus("failure");
            res.setUsername("");
        }
        /*
        Query checkIfExistUser = new Query();
        checkIfExistUser.addCriteria(Criteria.where("username").is(regform.getUsername()));
        List<User> users = mongoTemplate.find(checkIfExistUser,User.class);
        */
        return res;
    }
    
    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/login",method = RequestMethod.POST, consumes = {"application/json"})
    @ResponseBody
    public RegistrationLoginResult login(@RequestBody RegistrationLoginForm logform){
        RegistrationLoginResult res = new RegistrationLoginResult();
        UserModel loginRequestUser = userRepository.findByusername(logform.getUsername());

        if(loginRequestUser != null && loginRequestUser.getPassword().equals(logform.getPassword())){
            //TODO -- configure Java Security Token for Angular -- I need to learn it first (Sean)
            // For now we just pass username and success statement to the front end to imitate 

            User securityUser = new User(loginRequestUser.getUsername(),loginRequestUser.getPassword(),true,true,true,true,getAuthorities());
                
            res.setStatus("success");
            res.setUsername(loginRequestUser.getUsername());
        } else {
            //Incorrect login details
            res.setStatus("failure");
            res.setUsername("");
        }
        return res;
    }

    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
        authList.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authList;
    }
}