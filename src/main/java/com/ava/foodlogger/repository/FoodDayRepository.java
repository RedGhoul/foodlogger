package com.ava.foodlogger.repository;

import com.ava.foodlogger.domain.FoodDay;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FoodDay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodDayRepository extends JpaRepository<FoodDay, Long> {
    @Query("select foodDay from FoodDay foodDay where foodDay.user.login = ?#{principal.username}")
    List<FoodDay> findByUserIsCurrentUser();
}
