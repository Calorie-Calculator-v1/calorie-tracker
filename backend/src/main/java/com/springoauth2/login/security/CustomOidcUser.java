package com.springoauth2.login.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Map;

// Wraps the OidcUser Spring builds from Google's ID token, but overrides
// getName() to return OUR internal user id instead of Google's "sub" claim.
public class CustomOidcUser implements OidcUser, AppPrincipal {

    private final OidcUser delegate;
    private final Long userId;

    public CustomOidcUser(OidcUser delegate, Long userId) {
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
    public Map<String, Object> getClaims() {
        return delegate.getClaims();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return delegate.getUserInfo();
    }

    @Override
    public OidcIdToken getIdToken() {
        return delegate.getIdToken();
    }

    @Override
    public Long getUserId() {
        return userId;
    }
}