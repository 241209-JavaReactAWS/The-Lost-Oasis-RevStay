package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Notification;
import com.Revature.RevStay.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(this.notificationService.getAllUserNotifications(userDetails.getUsername()));
    }

    @PostMapping("/{notificationId}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Integer notificationId) {
        this.notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}
