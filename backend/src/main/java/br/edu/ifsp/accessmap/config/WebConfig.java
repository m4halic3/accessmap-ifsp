package br.edu.ifsp.accessmap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Serve o front-end (as páginas .html da raiz e as pastas assets/ e espacos/) na mesma
 * origem da API, para o navegador chamar /api sem precisar de CORS.
 * Só esses caminhos ficam expostos: backend/, scripts/ e .git/ não.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AccessmapProperties props;

    public WebConfig(AccessmapProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String raiz = props.pastaFrontend().toUri().toString();
        if (!raiz.endsWith("/")) raiz += "/";

        registry.addResourceHandler("/assets/**").addResourceLocations(raiz + "assets/");
        // Pacotes dos espaços (espaco.json, locais.json e imagens próprias de cada espaço)
        registry.addResourceHandler("/espacos/**").addResourceLocations(raiz + "espacos/");
        registry.addResourceHandler("/*.html").addResourceLocations(raiz);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
