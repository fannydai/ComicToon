package server.Jotto.Models;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserModel, String>{
    public UserModel findByUsername(String username);
    public List<UserModel> findAll();
}