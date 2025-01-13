package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.NotificationRepository;
import com.Revature.RevStay.models.Notification;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendNotification(User recipient, String subject, String message) {
        Notification notification = new Notification(recipient, subject, message);
        return this.notificationRepository.save(notification);
    }

    public List<Notification> getAllUserNotifications(String email) {
        List<Notification> notifications = this.notificationRepository.findAllByUserEmail(email);
        notifications.sort(Comparator.comparing(Notification::getTimestamp).reversed());
        return notifications;
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
