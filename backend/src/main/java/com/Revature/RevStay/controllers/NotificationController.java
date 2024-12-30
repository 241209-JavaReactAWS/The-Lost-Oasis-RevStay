package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Notification;
import com.Revature.RevStay.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestAttribute UserDetails userDetails) {
        return ResponseEntity.ok(this.notificationService.getAllUserNotifications(userDetails.getUserId()));
    }

    @PostMapping("/{notificationId}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Integer notificationId) {
        this.notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}
