package com.mackenzie.achadosdoados.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

/**
 * Simple global exception handler to map predictable RuntimeExceptions
 * (validation / business rule failures) to 4xx responses with a JSON body
 * containing a message. This improves frontend UX during development.
 */
@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        // Return 400 Bad Request with a simple JSON message
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
}
