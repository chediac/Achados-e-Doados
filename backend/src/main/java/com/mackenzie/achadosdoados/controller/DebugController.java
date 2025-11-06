package com.mackenzie.achadosdoados.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private static final Logger logger = LoggerFactory.getLogger(DebugController.class);

    @PostMapping("/echo")
    public ResponseEntity<Map<String, String>> echo(@RequestBody String body) {
        logger.info("[DEBUG ECHO] Received raw body: {}", body);
        return ResponseEntity.ok(Map.of("body", body == null ? "" : body));
    }
}
