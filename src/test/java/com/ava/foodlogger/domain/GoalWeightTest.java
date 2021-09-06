package com.ava.foodlogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ava.foodlogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GoalWeightTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GoalWeight.class);
        GoalWeight goalWeight1 = new GoalWeight();
        goalWeight1.setId(1L);
        GoalWeight goalWeight2 = new GoalWeight();
        goalWeight2.setId(goalWeight1.getId());
        assertThat(goalWeight1).isEqualTo(goalWeight2);
        goalWeight2.setId(2L);
        assertThat(goalWeight1).isNotEqualTo(goalWeight2);
        goalWeight1.setId(null);
        assertThat(goalWeight1).isNotEqualTo(goalWeight2);
    }
}
