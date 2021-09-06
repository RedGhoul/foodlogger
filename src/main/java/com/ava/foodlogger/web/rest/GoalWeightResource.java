package com.ava.foodlogger.web.rest;

import com.ava.foodlogger.domain.GoalWeight;
import com.ava.foodlogger.repository.GoalWeightRepository;
import com.ava.foodlogger.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ava.foodlogger.domain.GoalWeight}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GoalWeightResource {

    private final Logger log = LoggerFactory.getLogger(GoalWeightResource.class);

    private static final String ENTITY_NAME = "goalWeight";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GoalWeightRepository goalWeightRepository;

    public GoalWeightResource(GoalWeightRepository goalWeightRepository) {
        this.goalWeightRepository = goalWeightRepository;
    }

    /**
     * {@code POST  /goal-weights} : Create a new goalWeight.
     *
     * @param goalWeight the goalWeight to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new goalWeight, or with status {@code 400 (Bad Request)} if the goalWeight has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/goal-weights")
    public ResponseEntity<GoalWeight> createGoalWeight(@Valid @RequestBody GoalWeight goalWeight) throws URISyntaxException {
        log.debug("REST request to save GoalWeight : {}", goalWeight);
        if (goalWeight.getId() != null) {
            throw new BadRequestAlertException("A new goalWeight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GoalWeight result = goalWeightRepository.save(goalWeight);
        return ResponseEntity
            .created(new URI("/api/goal-weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /goal-weights/:id} : Updates an existing goalWeight.
     *
     * @param id the id of the goalWeight to save.
     * @param goalWeight the goalWeight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated goalWeight,
     * or with status {@code 400 (Bad Request)} if the goalWeight is not valid,
     * or with status {@code 500 (Internal Server Error)} if the goalWeight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/goal-weights/{id}")
    public ResponseEntity<GoalWeight> updateGoalWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GoalWeight goalWeight
    ) throws URISyntaxException {
        log.debug("REST request to update GoalWeight : {}, {}", id, goalWeight);
        if (goalWeight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, goalWeight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!goalWeightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GoalWeight result = goalWeightRepository.save(goalWeight);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, goalWeight.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /goal-weights/:id} : Partial updates given fields of an existing goalWeight, field will ignore if it is null
     *
     * @param id the id of the goalWeight to save.
     * @param goalWeight the goalWeight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated goalWeight,
     * or with status {@code 400 (Bad Request)} if the goalWeight is not valid,
     * or with status {@code 404 (Not Found)} if the goalWeight is not found,
     * or with status {@code 500 (Internal Server Error)} if the goalWeight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/goal-weights/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<GoalWeight> partialUpdateGoalWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GoalWeight goalWeight
    ) throws URISyntaxException {
        log.debug("REST request to partial update GoalWeight partially : {}, {}", id, goalWeight);
        if (goalWeight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, goalWeight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!goalWeightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GoalWeight> result = goalWeightRepository
            .findById(goalWeight.getId())
            .map(
                existingGoalWeight -> {
                    if (goalWeight.getWeight() != null) {
                        existingGoalWeight.setWeight(goalWeight.getWeight());
                    }
                    if (goalWeight.getCreatedDate() != null) {
                        existingGoalWeight.setCreatedDate(goalWeight.getCreatedDate());
                    }

                    return existingGoalWeight;
                }
            )
            .map(goalWeightRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, goalWeight.getId().toString())
        );
    }

    /**
     * {@code GET  /goal-weights} : get all the goalWeights.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of goalWeights in body.
     */
    @GetMapping("/goal-weights")
    public List<GoalWeight> getAllGoalWeights() {
        log.debug("REST request to get all GoalWeights");
        return goalWeightRepository.findAll();
    }

    /**
     * {@code GET  /goal-weights/:id} : get the "id" goalWeight.
     *
     * @param id the id of the goalWeight to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the goalWeight, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/goal-weights/{id}")
    public ResponseEntity<GoalWeight> getGoalWeight(@PathVariable Long id) {
        log.debug("REST request to get GoalWeight : {}", id);
        Optional<GoalWeight> goalWeight = goalWeightRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(goalWeight);
    }

    /**
     * {@code DELETE  /goal-weights/:id} : delete the "id" goalWeight.
     *
     * @param id the id of the goalWeight to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/goal-weights/{id}")
    public ResponseEntity<Void> deleteGoalWeight(@PathVariable Long id) {
        log.debug("REST request to delete GoalWeight : {}", id);
        goalWeightRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
