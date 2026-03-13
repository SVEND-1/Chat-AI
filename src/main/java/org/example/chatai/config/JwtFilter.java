package org.example.chatai.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.chatai.users.api.dto.users.response.UserDTO;
import org.example.chatai.users.domain.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static reactor.netty.http.HttpConnectionLiveness.log;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public JwtFilter(JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Уберите "/**" из этого списка - это слишком широко
        return path.startsWith("/api/auth/") ||
                path.equals("/login") ||
                path.equals("/register") ||
                path.startsWith("/design/") ||
                path.startsWith("/javascript/") ||
                path.startsWith("/images/") ||
                path.equals("/") ||
                path.startsWith("/error");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractToken(request);

            if (token != null && jwtTokenProvider.isValidToken(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDTO user = userService.findUserByEmail(email);

                    if (user != null) {
                        List<SimpleGrantedAuthority> authorities =
                                Collections.singletonList(user.role().toAuthority());

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(user, null, authorities);

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                        log.debug("Аутентификация установлена для пользователя: {}", email);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Ошибка в JwtFilter: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        // 1. Пробуем из заголовка Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // 2. Пробуем из куки
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(cookie -> "jwtToken".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}