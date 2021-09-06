package com.ava.foodlogger.repository;

import com.ava.foodlogger.domain.FoodEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FoodEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodEntryRepository extends JpaRepository<FoodEntry, Long> {}
