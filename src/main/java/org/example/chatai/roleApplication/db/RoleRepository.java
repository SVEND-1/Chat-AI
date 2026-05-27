package org.example.chatai.roleApplication.db;

import org.example.chatai.users.db.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<RoleApplicationEntity, Long> {
    List<RoleApplicationEntity> findAllByUser(UserEntity user);

    @Query("""
            SELECT r FROM RoleApplicationEntity r
            WHERE r.statusRole = :statusRole OR :statusRole IS NULL
            """)
    List<RoleApplicationEntity> findAllByFilter(
            @Param("statusRole") StatusRole statusRole,
            Pageable pageable);
}
