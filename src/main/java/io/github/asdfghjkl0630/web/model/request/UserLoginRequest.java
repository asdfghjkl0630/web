package io.github.asdfghjkl0630.web.model.request;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String username;
    private String password;
}