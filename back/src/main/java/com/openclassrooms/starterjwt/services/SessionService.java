package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.ResourceNotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;

    private final UserService userService;

    public SessionService(SessionRepository sessionRepository, UserService userService) {
        this.sessionRepository = sessionRepository;
        this.userService = userService;
    }

    public Session create(Session session) {
        return this.sessionRepository.save(session);
    }

    public void delete(Long id) {
        this.getById(id);

        this.sessionRepository.deleteById(id);
    }

    public List<Session> findAll() {
        return this.sessionRepository.findAll();
    }

    public Session getById(Long id) {
        Session session = this.sessionRepository.findById(id).orElse(null);

        if (session == null) {
            throw new ResourceNotFoundException("Session non trouvée");
        }
        return session;
    }

    public Session update(Long id, Session session) {
        session.setId(id);
        return this.sessionRepository.save(session);
    }

    public void participate(Long id, Long userId) {
        Session session = this.getById(id);
        User user = this.userService.findById(userId);

        boolean alreadyParticipate = session.getUsers().stream().anyMatch(o -> o.getId().equals(userId));
        if (alreadyParticipate) {
            throw new BadRequestException();
        }

        session.getUsers().add(user);

        this.sessionRepository.save(session);
    }

    public void noLongerParticipate(Long id, Long userId) {
        Session session = this.getById(id);
        
        boolean alreadyParticipate = session.getUsers().stream().anyMatch(o -> o.getId().equals(userId));
        if (!alreadyParticipate) {
            throw new BadRequestException();
        }

        session.setUsers(session.getUsers().stream().filter(user -> !user.getId().equals(userId)).collect(Collectors.toList()));

        this.sessionRepository.save(session);
    }
}
