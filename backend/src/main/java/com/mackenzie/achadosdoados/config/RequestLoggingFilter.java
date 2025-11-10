package com.mackenzie.achadosdoados.config;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Development-only filter that logs incoming request method, URI and raw body.
 * Uses ContentCachingRequestWrapper so reading the body here does not prevent
 * the controller from later reading it.
 */
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);

        try {
            filterChain.doFilter(wrappedRequest, response);
        } finally {
            String method = request.getMethod();
            String uri = request.getRequestURI();

            byte[] buf = wrappedRequest.getContentAsByteArray();
            String body = "";
            if (buf != null && buf.length > 0) {
                body = new String(buf, StandardCharsets.UTF_8);
            }

            logger.info("[REQ] {} {} -- body: {}", method, uri, body);
        }
    }
}
