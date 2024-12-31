package com.Revature.RevStay.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Configuration {
    @Bean
    public S3Client buildS3Client() {
        return S3Client
                .builder()
                .build();
    }
}
