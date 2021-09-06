package com.ava.foodlogger.repository;

import com.ava.foodlogger.domain.CurrentWeight;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CurrentWeight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CurrentWeightRepository extends JpaRepository<CurrentWeight, Long> {
    @Query("select currentWeight from CurrentWeight currentWeight where currentWeight.user.login = ?#{principal.username}")
    List<CurrentWeight> findByUserIsCurrentUser();
}
