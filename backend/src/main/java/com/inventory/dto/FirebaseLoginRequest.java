package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public class FirebaseLoginRequest {

    private String uid;

    @NotBlank(message = "Email is required")
    private String email;

    private String displayName;
    private String photoURL;
    private String idToken;

    public FirebaseLoginRequest() {}

    public FirebaseLoginRequest(String uid, String email, String displayName, String photoURL, String idToken) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.idToken = idToken;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
