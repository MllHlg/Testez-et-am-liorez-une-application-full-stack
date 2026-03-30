package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.EmailAlreadyUsedException;
import com.openclassrooms.starterjwt.exception.ResourceNotFoundException;
import com.openclassrooms.starterjwt.exception.UnauthorizedException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import java.util.Objects;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void delete(Long id, String currentUsername) {
        User user = this.findById(id);

        if (!Objects.equals(currentUsername, user.getEmail())) {
            throw new UnauthorizedException("Vous ne pouvez pas supprimer ce compte");
        }

        this.userRepository.deleteById(id);
    }

    public User findById(Long id) {
        User user = this.userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        return user;
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email).orElse(null);
    }

    public User register(User user) {
        if (this.findByEmail(user.getEmail()) != null) {
            throw new EmailAlreadyUsedException("Error: Email is already taken!"); 
        }

        return this.userRepository.save(user);
    }
}
