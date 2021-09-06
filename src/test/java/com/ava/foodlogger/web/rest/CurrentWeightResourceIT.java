package com.ava.foodlogger.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ava.foodlogger.IntegrationTest;
import com.ava.foodlogger.domain.CurrentWeight;
import com.ava.foodlogger.repository.CurrentWeightRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CurrentWeightResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CurrentWeightResourceIT {

    private static final Float DEFAULT_WEIGHT = 1F;
    private static final Float UPDATED_WEIGHT = 2F;

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/current-weights";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CurrentWeightRepository currentWeightRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCurrentWeightMockMvc;

    private CurrentWeight currentWeight;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurrentWeight createEntity(EntityManager em) {
        CurrentWeight currentWeight = new CurrentWeight().weight(DEFAULT_WEIGHT).createdDate(DEFAULT_CREATED_DATE);
        return currentWeight;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurrentWeight createUpdatedEntity(EntityManager em) {
        CurrentWeight currentWeight = new CurrentWeight().weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);
        return currentWeight;
    }

    @BeforeEach
    public void initTest() {
        currentWeight = createEntity(em);
    }

    @Test
    @Transactional
    void createCurrentWeight() throws Exception {
        int databaseSizeBeforeCreate = currentWeightRepository.findAll().size();
        // Create the CurrentWeight
        restCurrentWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(currentWeight)))
            .andExpect(status().isCreated());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeCreate + 1);
        CurrentWeight testCurrentWeight = currentWeightList.get(currentWeightList.size() - 1);
        assertThat(testCurrentWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testCurrentWeight.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createCurrentWeightWithExistingId() throws Exception {
        // Create the CurrentWeight with an existing ID
        currentWeight.setId(1L);

        int databaseSizeBeforeCreate = currentWeightRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCurrentWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(currentWeight)))
            .andExpect(status().isBadRequest());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = currentWeightRepository.findAll().size();
        // set the field null
        currentWeight.setWeight(null);

        // Create the CurrentWeight, which fails.

        restCurrentWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(currentWeight)))
            .andExpect(status().isBadRequest());

        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCurrentWeights() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        // Get all the currentWeightList
        restCurrentWeightMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(currentWeight.getId().intValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getCurrentWeight() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        // Get the currentWeight
        restCurrentWeightMockMvc
            .perform(get(ENTITY_API_URL_ID, currentWeight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(currentWeight.getId().intValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCurrentWeight() throws Exception {
        // Get the currentWeight
        restCurrentWeightMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCurrentWeight() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();

        // Update the currentWeight
        CurrentWeight updatedCurrentWeight = currentWeightRepository.findById(currentWeight.getId()).get();
        // Disconnect from session so that the updates on updatedCurrentWeight are not directly saved in db
        em.detach(updatedCurrentWeight);
        updatedCurrentWeight.weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);

        restCurrentWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCurrentWeight.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCurrentWeight))
            )
            .andExpect(status().isOk());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
        CurrentWeight testCurrentWeight = currentWeightList.get(currentWeightList.size() - 1);
        assertThat(testCurrentWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testCurrentWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, currentWeight.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(currentWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(currentWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(currentWeight)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCurrentWeightWithPatch() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();

        // Update the currentWeight using partial update
        CurrentWeight partialUpdatedCurrentWeight = new CurrentWeight();
        partialUpdatedCurrentWeight.setId(currentWeight.getId());

        partialUpdatedCurrentWeight.createdDate(UPDATED_CREATED_DATE);

        restCurrentWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurrentWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurrentWeight))
            )
            .andExpect(status().isOk());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
        CurrentWeight testCurrentWeight = currentWeightList.get(currentWeightList.size() - 1);
        assertThat(testCurrentWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testCurrentWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateCurrentWeightWithPatch() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();

        // Update the currentWeight using partial update
        CurrentWeight partialUpdatedCurrentWeight = new CurrentWeight();
        partialUpdatedCurrentWeight.setId(currentWeight.getId());

        partialUpdatedCurrentWeight.weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);

        restCurrentWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurrentWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurrentWeight))
            )
            .andExpect(status().isOk());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
        CurrentWeight testCurrentWeight = currentWeightList.get(currentWeightList.size() - 1);
        assertThat(testCurrentWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testCurrentWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, currentWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(currentWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(currentWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCurrentWeight() throws Exception {
        int databaseSizeBeforeUpdate = currentWeightRepository.findAll().size();
        currentWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurrentWeightMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(currentWeight))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CurrentWeight in the database
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCurrentWeight() throws Exception {
        // Initialize the database
        currentWeightRepository.saveAndFlush(currentWeight);

        int databaseSizeBeforeDelete = currentWeightRepository.findAll().size();

        // Delete the currentWeight
        restCurrentWeightMockMvc
            .perform(delete(ENTITY_API_URL_ID, currentWeight.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CurrentWeight> currentWeightList = currentWeightRepository.findAll();
        assertThat(currentWeightList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
