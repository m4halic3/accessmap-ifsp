package br.edu.ifsp.accessmap.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Configuração de um espaço: plantas, áreas (cores e ícones) e textos da
 * interface. É o MESMO formato do arquivo espacos/&lt;slug&gt;/espaco.json,
 * para o front-end ler igual a resposta da API e o arquivo estático.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record EspacoDto(
        String slug,
        String nome,
        String tipo,
        String genero,
        String cidade,
        Boolean padrao,
        Map<String, String> textos,
        String mapaLocalizacao,
        List<String> destaques,
        List<PlantaInfo> plantas,
        List<AreaInfo> areas) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlantaInfo(
            String codigo,
            String nome,
            String rotuloCurto,
            String descricao,
            Boolean principal,
            String andar,
            String bloco,
            String prefixoNome,
            Integer largura,
            Integer altura,
            String imagem,
            String hd,
            Double proporcaoArte,
            String alt) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AreaInfo(
            String codigo,
            String rotulo,
            String cor,
            String icone,
            String predio,
            String oQue,
            Boolean naLegenda) {
    }

    /** Parte guardada na coluna espaco.configuracao (JSON). */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Extras(String genero, Map<String, String> textos, String mapaLocalizacao, List<String> destaques) {
    }
}
