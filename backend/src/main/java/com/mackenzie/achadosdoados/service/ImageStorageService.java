package com.mackenzie.achadosdoados.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Serviço para armazenar e recuperar imagens no sistema de arquivos.
 */
@Service
public class ImageStorageService {

    private final Path rootLocation = Paths.get("data/images");

    public ImageStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar diretório de imagens", e);
        }
    }

    /**
     * Salva uma imagem no sistema de arquivos.
     * 
     * @param file Arquivo enviado
     * @return Nome do arquivo salvo (UUID + extensão original)
     */
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Arquivo vazio");
            }

            // Gerar nome único
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Salvar arquivo
            Path destinationFile = rootLocation.resolve(filename).normalize().toAbsolutePath();
            
            // Validar que o arquivo está dentro do diretório permitido
            if (!destinationFile.getParent().equals(rootLocation.toAbsolutePath())) {
                throw new RuntimeException("Não é possível salvar arquivo fora do diretório permitido");
            }

            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
            
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar arquivo", e);
        }
    }

    /**
     * Carrega um arquivo de imagem.
     * 
     * @param filename Nome do arquivo
     * @return Path do arquivo
     */
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    /**
     * Deleta uma imagem se ela existir.
     * 
     * @param filename Nome do arquivo
     */
    public void delete(String filename) {
        try {
            if (filename != null && !filename.isEmpty()) {
                Path file = load(filename);
                Files.deleteIfExists(file);
            }
        } catch (IOException e) {
            // Ignora erro de deleção
        }
    }
}
