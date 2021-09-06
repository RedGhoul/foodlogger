package com.ava.foodlogger.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ava.foodlogger.IntegrationTest;
import com.ava.foodlogger.domain.FoodDay;
import com.ava.foodlogger.repository.FoodDayRepository;
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
 * Integration tests for the {@link FoodDayResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FoodDayResourceIT {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/food-days";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FoodDayRepository foodDayRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFoodDayMockMvc;

    private FoodDay foodDay;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FoodDay createEntity(EntityManager em) {
        FoodDay foodDay = new FoodDay().createdDate(DEFAULT_CREATED_DATE);
        return foodDay;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FoodDay createUpdatedEntity(EntityManager em) {
        FoodDay foodDay = new FoodDay().createdDate(UPDATED_CREATED_DATE);
        return foodDay;
    }

    @BeforeEach
    public void initTest() {
        foodDay = createEntity(em);
    }

    @Test
    @Transactional
    void createFoodDay() throws Exception {
        int databaseSizeBeforeCreate = foodDayRepository.findAll().size();
        // Create the FoodDay
        restFoodDayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foodDay)))
            .andExpect(status().isCreated());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeCreate + 1);
        FoodDay testFoodDay = foodDayList.get(foodDayList.size() - 1);
        assertThat(testFoodDay.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createFoodDayWithExistingId() throws Exception {
        // Create the FoodDay with an existing ID
        foodDay.setId(1L);

        int databaseSizeBeforeCreate = foodDayRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFoodDayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foodDay)))
            .andExpect(status().isBadRequest());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFoodDays() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        // Get all the foodDayList
        restFoodDayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(foodDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getFoodDay() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        // Get the foodDay
        restFoodDayMockMvc
            .perform(get(ENTITY_API_URL_ID, foodDay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(foodDay.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFoodDay() throws Exception {
        // Get the foodDay
        restFoodDayMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFoodDay() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();

        // Update the foodDay
        FoodDay updatedFoodDay = foodDayRepository.findById(foodDay.getId()).get();
        // Disconnect from session so that the updates on updatedFoodDay are not directly saved in db
        em.detach(updatedFoodDay);
        updatedFoodDay.createdDate(UPDATED_CREATED_DATE);

        restFoodDayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFoodDay.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFoodDay))
            )
            .andExpect(status().isOk());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
        FoodDay testFoodDay = foodDayList.get(foodDayList.size() - 1);
        assertThat(testFoodDay.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, foodDay.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodDay))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodDay))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foodDay)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFoodDayWithPatch() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();

        // Update the foodDay using partial update
        FoodDay partialUpdatedFoodDay = new FoodDay();
        partialUpdatedFoodDay.setId(foodDay.getId());

        restFoodDayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoodDay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoodDay))
            )
            .andExpect(status().isOk());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
        FoodDay testFoodDay = foodDayList.get(foodDayList.size() - 1);
        assertThat(testFoodDay.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateFoodDayWithPatch() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();

        // Update the foodDay using partial update
        FoodDay partialUpdatedFoodDay = new FoodDay();
        partialUpdatedFoodDay.setId(foodDay.getId());

        partialUpdatedFoodDay.createdDate(UPDATED_CREATED_DATE);

        restFoodDayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoodDay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoodDay))
            )
            .andExpect(status().isOk());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
        FoodDay testFoodDay = foodDayList.get(foodDayList.size() - 1);
        assertThat(testFoodDay.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, foodDay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foodDay))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foodDay))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFoodDay() throws Exception {
        int databaseSizeBeforeUpdate = foodDayRepository.findAll().size();
        foodDay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodDayMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(foodDay)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FoodDay in the database
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFoodDay() throws Exception {
        // Initialize the database
        foodDayRepository.saveAndFlush(foodDay);

        int databaseSizeBeforeDelete = foodDayRepository.findAll().size();

        // Delete the foodDay
        restFoodDayMockMvc
            .perform(delete(ENTITY_API_URL_ID, foodDay.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FoodDay> foodDayList = foodDayRepository.findAll();
        assertThat(foodDayList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
