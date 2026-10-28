package br.edu.ifsp.accessmap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AccessmapApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccessmapApplication.class, args);
    }
}
