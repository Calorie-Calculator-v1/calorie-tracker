package com.springoauth2.login.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

// Wraps the OAuth2User Spring builds from GitHub's response, but overrides
// getName() to return OUR internal user id instead of GitHub's raw attributes.
public class CustomOAuth2User implements OAuth2User, AppPrincipal {

    private final OAuth2User delegate;
    private final Long userId;

    public CustomOAuth2User(OAuth2User delegate, Long userId) {
        this.delegate = delegate;
        this.userId = userId;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }

    @Override
    public String getName() {
        return String.valueOf(userId);
    }

    @Override
    public Long getUserId() {
        return userId;
    }
}