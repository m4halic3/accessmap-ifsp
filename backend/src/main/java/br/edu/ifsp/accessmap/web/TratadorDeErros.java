package br.edu.ifsp.accessmap.web;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import br.edu.ifsp.accessmap.dto.ErroResposta;
import br.edu.ifsp.accessmap.servico.RegraNegocioException;

/** Converte os erros em respostas JSON { mensagem, campos } que o front-end exibe. */
@RestControllerAdvice
public class TratadorDeErros {

    private static final Logger log = LoggerFactory.getLogger(TratadorDeErros.class);

    @ExceptionHandler(RegraNegocioException.class)
    ResponseEntity<ErroResposta> regraDeNegocio(RegraNegocioException e) {
        return ResponseEntity.status(e.getStatus()).body(new ErroResposta(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors().forEach(f -> campos.putIfAbsent(f.getField(), f.getDefaultMessage()));
        String mensagem = campos.values().stream().findFirst().orElse("Dados inválidos.");
        return ResponseEntity.badRequest().body(new ErroResposta(mensagem, campos));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class, MissingServletRequestPartException.class})
    ResponseEntity<ErroResposta> requisicaoMalFormada(Exception e) {
        return ResponseEntity.badRequest().body(new ErroResposta("Dados inválidos ou incompletos."));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<ErroResposta> arquivoGrande(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(new ErroResposta("A imagem passa do limite de 25 MB."));
    }

    // Ex.: dois administradores salvando o mesmo nome ao mesmo tempo (chave única)
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ErroResposta> integridade(DataIntegrityViolationException e) {
        log.warn("Violação de integridade: {}", e.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroResposta("Os dados conflitam com um registro existente (ex.: nome repetido)."));
    }
}
