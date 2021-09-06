package com.ava.foodlogger.repository;

import com.ava.foodlogger.domain.GoalWeight;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the GoalWeight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GoalWeightRepository extends JpaRepository<GoalWeight, Long> {
    @Query("select goalWeight from GoalWeight goalWeight where goalWeight.user.login = ?#{principal.username}")
    List<GoalWeight> findByUserIsCurrentUser();
}
