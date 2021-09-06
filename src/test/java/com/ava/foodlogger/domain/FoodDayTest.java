package com.ava.foodlogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ava.foodlogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FoodDayTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FoodDay.class);
        FoodDay foodDay1 = new FoodDay();
        foodDay1.setId(1L);
        FoodDay foodDay2 = new FoodDay();
        foodDay2.setId(foodDay1.getId());
        assertThat(foodDay1).isEqualTo(foodDay2);
        foodDay2.setId(2L);
        assertThat(foodDay1).isNotEqualTo(foodDay2);
        foodDay1.setId(null);
        assertThat(foodDay1).isNotEqualTo(foodDay2);
    }
}
