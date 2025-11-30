package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.RagDocumentChunk;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RagDocumentChunkRepository extends JpaRepository<RagDocumentChunk, Long> {
    List<RagDocumentChunk> findByFileNameOrderByChunkIndexAsc(String fileName);
}
