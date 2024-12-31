package com.Revature.RevStay.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Configuration
public class S3Configuration {
    @Bean
    public S3AsyncClient buildS3AsyncClient() {
        return S3AsyncClient
                .builder()
                .build();
    }
}
