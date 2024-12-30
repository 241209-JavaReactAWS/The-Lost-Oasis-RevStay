package com.Revature.RevStay.service;

import com.Revature.RevStay.daos.NotificationRepository;
import com.Revature.RevStay.models.Notification;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendNotification(User recipient, String message) {
        Notification notification = new Notification(recipient, message);
        return this.notificationRepository.save(notification);
    }

    public List<Notification> getAllUserNotifications(Integer userId) {
        return this.notificationRepository.findAllByUserIdAndReadFalse(userId);
    }

    public void markNotificationAsRead(Integer notificationId) {
        Optional<Notification> notificationOpt = this.notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            this.notificationRepository.save(notification);
        } else throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
