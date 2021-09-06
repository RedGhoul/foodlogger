package com.ava.foodlogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ava.foodlogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CurrentWeightTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CurrentWeight.class);
        CurrentWeight currentWeight1 = new CurrentWeight();
        currentWeight1.setId(1L);
        CurrentWeight currentWeight2 = new CurrentWeight();
        currentWeight2.setId(currentWeight1.getId());
        assertThat(currentWeight1).isEqualTo(currentWeight2);
        currentWeight2.setId(2L);
        assertThat(currentWeight1).isNotEqualTo(currentWeight2);
        currentWeight1.setId(null);
        assertThat(currentWeight1).isNotEqualTo(currentWeight2);
    }
}
