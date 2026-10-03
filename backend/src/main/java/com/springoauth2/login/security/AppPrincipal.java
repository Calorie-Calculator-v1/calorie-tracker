package com.springoauth2.login.security;

public interface AppPrincipal {
    Long getUserId(); // change to match UserEntity's actual id type if not Long
}