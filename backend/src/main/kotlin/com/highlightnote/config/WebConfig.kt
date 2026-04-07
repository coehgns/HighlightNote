package com.highlightnote.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
    @Value("\${highlightnote.web.allowed-origins}")
    allowedOrigins: String,
) : WebMvcConfigurer {

    private val allowedOriginPatterns = allowedOrigins
        .split(',')
        .map { it.trim() }
        .filter { it.isNotBlank() }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOriginPatterns(*allowedOriginPatterns.toTypedArray())
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("*")
    }
}
