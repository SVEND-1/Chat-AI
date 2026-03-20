package org.example.chatai.roleApplication.db;

import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.users.db.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<RoleApplicationEntity, Long> {
    List<RoleApplicationEntity> findAllByUser(UserEntity user);
}
