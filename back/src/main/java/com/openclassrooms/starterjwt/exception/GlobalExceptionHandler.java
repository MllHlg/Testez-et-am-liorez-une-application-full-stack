package com.openclassrooms.starterjwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<?> handleNumberFormatException(NumberFormatException ex) {
        return ResponseEntity.badRequest().build();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity.notFound().build();   
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> NotFoundException(NotFoundException ex) {
        return ResponseEntity.notFound().build();   
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());    
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex) {
        return ResponseEntity.badRequest().build();
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<?> handleEmailAlreadyUsedException(EmailAlreadyUsedException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
    }
}
