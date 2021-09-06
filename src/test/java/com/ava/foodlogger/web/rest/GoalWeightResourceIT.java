package com.ava.foodlogger.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ava.foodlogger.IntegrationTest;
import com.ava.foodlogger.domain.GoalWeight;
import com.ava.foodlogger.repository.GoalWeightRepository;
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
 * Integration tests for the {@link GoalWeightResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GoalWeightResourceIT {

    private static final Float DEFAULT_WEIGHT = 1F;
    private static final Float UPDATED_WEIGHT = 2F;

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/goal-weights";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GoalWeightRepository goalWeightRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGoalWeightMockMvc;

    private GoalWeight goalWeight;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GoalWeight createEntity(EntityManager em) {
        GoalWeight goalWeight = new GoalWeight().weight(DEFAULT_WEIGHT).createdDate(DEFAULT_CREATED_DATE);
        return goalWeight;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GoalWeight createUpdatedEntity(EntityManager em) {
        GoalWeight goalWeight = new GoalWeight().weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);
        return goalWeight;
    }

    @BeforeEach
    public void initTest() {
        goalWeight = createEntity(em);
    }

    @Test
    @Transactional
    void createGoalWeight() throws Exception {
        int databaseSizeBeforeCreate = goalWeightRepository.findAll().size();
        // Create the GoalWeight
        restGoalWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(goalWeight)))
            .andExpect(status().isCreated());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeCreate + 1);
        GoalWeight testGoalWeight = goalWeightList.get(goalWeightList.size() - 1);
        assertThat(testGoalWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testGoalWeight.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createGoalWeightWithExistingId() throws Exception {
        // Create the GoalWeight with an existing ID
        goalWeight.setId(1L);

        int databaseSizeBeforeCreate = goalWeightRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGoalWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(goalWeight)))
            .andExpect(status().isBadRequest());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = goalWeightRepository.findAll().size();
        // set the field null
        goalWeight.setWeight(null);

        // Create the GoalWeight, which fails.

        restGoalWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(goalWeight)))
            .andExpect(status().isBadRequest());

        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGoalWeights() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        // Get all the goalWeightList
        restGoalWeightMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(goalWeight.getId().intValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getGoalWeight() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        // Get the goalWeight
        restGoalWeightMockMvc
            .perform(get(ENTITY_API_URL_ID, goalWeight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(goalWeight.getId().intValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGoalWeight() throws Exception {
        // Get the goalWeight
        restGoalWeightMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGoalWeight() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();

        // Update the goalWeight
        GoalWeight updatedGoalWeight = goalWeightRepository.findById(goalWeight.getId()).get();
        // Disconnect from session so that the updates on updatedGoalWeight are not directly saved in db
        em.detach(updatedGoalWeight);
        updatedGoalWeight.weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);

        restGoalWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGoalWeight.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGoalWeight))
            )
            .andExpect(status().isOk());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
        GoalWeight testGoalWeight = goalWeightList.get(goalWeightList.size() - 1);
        assertThat(testGoalWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testGoalWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, goalWeight.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(goalWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(goalWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(goalWeight)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGoalWeightWithPatch() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();

        // Update the goalWeight using partial update
        GoalWeight partialUpdatedGoalWeight = new GoalWeight();
        partialUpdatedGoalWeight.setId(goalWeight.getId());

        partialUpdatedGoalWeight.createdDate(UPDATED_CREATED_DATE);

        restGoalWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGoalWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGoalWeight))
            )
            .andExpect(status().isOk());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
        GoalWeight testGoalWeight = goalWeightList.get(goalWeightList.size() - 1);
        assertThat(testGoalWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testGoalWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateGoalWeightWithPatch() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();

        // Update the goalWeight using partial update
        GoalWeight partialUpdatedGoalWeight = new GoalWeight();
        partialUpdatedGoalWeight.setId(goalWeight.getId());

        partialUpdatedGoalWeight.weight(UPDATED_WEIGHT).createdDate(UPDATED_CREATED_DATE);

        restGoalWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGoalWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGoalWeight))
            )
            .andExpect(status().isOk());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
        GoalWeight testGoalWeight = goalWeightList.get(goalWeightList.size() - 1);
        assertThat(testGoalWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testGoalWeight.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, goalWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(goalWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(goalWeight))
            )
            .andExpect(status().isBadRequest());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGoalWeight() throws Exception {
        int databaseSizeBeforeUpdate = goalWeightRepository.findAll().size();
        goalWeight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGoalWeightMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(goalWeight))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GoalWeight in the database
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGoalWeight() throws Exception {
        // Initialize the database
        goalWeightRepository.saveAndFlush(goalWeight);

        int databaseSizeBeforeDelete = goalWeightRepository.findAll().size();

        // Delete the goalWeight
        restGoalWeightMockMvc
            .perform(delete(ENTITY_API_URL_ID, goalWeight.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GoalWeight> goalWeightList = goalWeightRepository.findAll();
        assertThat(goalWeightList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
