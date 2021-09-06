package com.ava.foodlogger.web.rest;

import com.ava.foodlogger.domain.FoodDay;
import com.ava.foodlogger.repository.FoodDayRepository;
import com.ava.foodlogger.repository.UserRepository;
import com.ava.foodlogger.security.SecurityUtils;
import com.ava.foodlogger.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ava.foodlogger.domain.FoodDay}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FoodDayResource {

    private final Logger log = LoggerFactory.getLogger(FoodDayResource.class);

    private static final String ENTITY_NAME = "foodDay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FoodDayRepository foodDayRepository;
    private final UserRepository userRepository;

    public FoodDayResource(FoodDayRepository foodDayRepository, UserRepository userRepository) {
        this.foodDayRepository = foodDayRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /food-days} : Create a new foodDay.
     *
     * @param foodDay the foodDay to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new foodDay, or with status {@code 400 (Bad Request)} if the foodDay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/food-days")
    public ResponseEntity<FoodDay> createFoodDay(@RequestBody FoodDay foodDay) throws URISyntaxException {
        log.debug("REST request to save FoodDay : {}", foodDay);
        if (foodDay.getId() != null) {
            throw new BadRequestAlertException("A new foodDay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String login = SecurityUtils.getCurrentUserLogin().orElse(null);
        foodDay.setUser(this.userRepository.findOneByLogin(login).get());
        FoodDay result = foodDayRepository.save(foodDay);
        return ResponseEntity
            .created(new URI("/api/food-days/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /food-days/:id} : Updates an existing foodDay.
     *
     * @param id the id of the foodDay to save.
     * @param foodDay the foodDay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodDay,
     * or with status {@code 400 (Bad Request)} if the foodDay is not valid,
     * or with status {@code 500 (Internal Server Error)} if the foodDay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/food-days/{id}")
    public ResponseEntity<FoodDay> updateFoodDay(@PathVariable(value = "id", required = false) final Long id, @RequestBody FoodDay foodDay)
        throws URISyntaxException {
        log.debug("REST request to update FoodDay : {}, {}", id, foodDay);
        if (foodDay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodDay.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodDayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FoodDay result = foodDayRepository.save(foodDay);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, foodDay.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /food-days/:id} : Partial updates given fields of an existing foodDay, field will ignore if it is null
     *
     * @param id the id of the foodDay to save.
     * @param foodDay the foodDay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodDay,
     * or with status {@code 400 (Bad Request)} if the foodDay is not valid,
     * or with status {@code 404 (Not Found)} if the foodDay is not found,
     * or with status {@code 500 (Internal Server Error)} if the foodDay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/food-days/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FoodDay> partialUpdateFoodDay(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodDay foodDay
    ) throws URISyntaxException {
        log.debug("REST request to partial update FoodDay partially : {}, {}", id, foodDay);
        if (foodDay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodDay.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodDayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FoodDay> result = foodDayRepository
            .findById(foodDay.getId())
            .map(
                existingFoodDay -> {
                    if (foodDay.getCreatedDate() != null) {
                        existingFoodDay.setCreatedDate(foodDay.getCreatedDate());
                    }

                    return existingFoodDay;
                }
            )
            .map(foodDayRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, foodDay.getId().toString())
        );
    }

    /**
     * {@code GET  /food-days} : get all the foodDays.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foodDays in body.
     */
    @GetMapping("/food-days")
    public List<FoodDay> getAllFoodDays() {
        log.debug("REST request to get all FoodDays");
        return foodDayRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /food-days/:id} : get the "id" foodDay.
     *
     * @param id the id of the foodDay to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the foodDay, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/food-days/{id}")
    public ResponseEntity<FoodDay> getFoodDay(@PathVariable Long id) {
        log.debug("REST request to get FoodDay : {}", id);
        Optional<FoodDay> foodDay = foodDayRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(foodDay);
    }

    /**
     * {@code DELETE  /food-days/:id} : delete the "id" foodDay.
     *
     * @param id the id of the foodDay to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/food-days/{id}")
    public ResponseEntity<Void> deleteFoodDay(@PathVariable Long id) {
        log.debug("REST request to delete FoodDay : {}", id);
        foodDayRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
