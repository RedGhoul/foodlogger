package com.ava.foodlogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ava.foodlogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FoodEntryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FoodEntry.class);
        FoodEntry foodEntry1 = new FoodEntry();
        foodEntry1.setId(1L);
        FoodEntry foodEntry2 = new FoodEntry();
        foodEntry2.setId(foodEntry1.getId());
        assertThat(foodEntry1).isEqualTo(foodEntry2);
        foodEntry2.setId(2L);
        assertThat(foodEntry1).isNotEqualTo(foodEntry2);
        foodEntry1.setId(null);
        assertThat(foodEntry1).isNotEqualTo(foodEntry2);
    }
}
