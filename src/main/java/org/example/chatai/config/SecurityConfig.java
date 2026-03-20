package org.example.chatai.config;


import org.example.chatai.users.api.dto.users.response.UserDTO;
import org.example.chatai.users.domain.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final UserService userService;
    private final JwtFilter jwtFilter;

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String[] allowedOrigins;

    public SecurityConfig(UserService userService,@Lazy JwtFilter jwtFilter) {
        this.userService = userService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {//TODO настроить
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(auth ->
                    auth
                            .requestMatchers(
                            "/", "/login", "/codeEmail", "/forgotPassword",
                            "/recoveryPassword", "/register", "/api/auth/**",
                            "/error","/*.html", "/*.css", "/*.js","/**",
                            "/api/support-ticket", "api/support-message"
                            ).permitAll()

                            .requestMatchers(
                                    "/admin", "/api/admin/role-request/**",   "/swagger-ui/**",
                                    "/swagger-ui.html", "/v3/api-docs/**", "/swagger-resources/**",
                                    "/webjars/**"
                            )
                            .permitAll()

                            .requestMatchers(
                                    "/test","/chooseTest","/createTest","/result","/dashboard",
                                    "/api/user-test/**","/api/user-answer","/api/users/**","/api/tests/**",
                                    "/api/questions","/tests/jwt"
                            ).authenticated()

                            .anyRequest().permitAll()
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                (request, response, authException)
                                        -> response.sendRedirect("/login")
                        )
                )

                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessUrl("/")
                        .deleteCookies("jwtToken")
                        .permitAll()
                )
                .build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                UserDTO user = userService.findUserByEmail(username);
                if(user == null)
                    throw new UsernameNotFoundException(username);
                Set<SimpleGrantedAuthority> roles = Collections.singleton(user.role().toAuthority());
                return new org.springframework.security.core.userdetails.User(user.email(),user.password(),roles);
            }
        };
    }

}