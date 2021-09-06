package com.ava.foodlogger.web.rest;

import com.ava.foodlogger.domain.CurrentWeight;
import com.ava.foodlogger.repository.CurrentWeightRepository;
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
 * REST controller for managing {@link com.ava.foodlogger.domain.CurrentWeight}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CurrentWeightResource {

    private final Logger log = LoggerFactory.getLogger(CurrentWeightResource.class);

    private static final String ENTITY_NAME = "currentWeight";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CurrentWeightRepository currentWeightRepository;

    public CurrentWeightResource(CurrentWeightRepository currentWeightRepository) {
        this.currentWeightRepository = currentWeightRepository;
    }

    /**
     * {@code POST  /current-weights} : Create a new currentWeight.
     *
     * @param currentWeight the currentWeight to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new currentWeight, or with status {@code 400 (Bad Request)} if the currentWeight has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/current-weights")
    public ResponseEntity<CurrentWeight> createCurrentWeight(@Valid @RequestBody CurrentWeight currentWeight) throws URISyntaxException {
        log.debug("REST request to save CurrentWeight : {}", currentWeight);
        if (currentWeight.getId() != null) {
            throw new BadRequestAlertException("A new currentWeight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CurrentWeight result = currentWeightRepository.save(currentWeight);
        return ResponseEntity
            .created(new URI("/api/current-weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /current-weights/:id} : Updates an existing currentWeight.
     *
     * @param id the id of the currentWeight to save.
     * @param currentWeight the currentWeight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated currentWeight,
     * or with status {@code 400 (Bad Request)} if the currentWeight is not valid,
     * or with status {@code 500 (Internal Server Error)} if the currentWeight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/current-weights/{id}")
    public ResponseEntity<CurrentWeight> updateCurrentWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CurrentWeight currentWeight
    ) throws URISyntaxException {
        log.debug("REST request to update CurrentWeight : {}, {}", id, currentWeight);
        if (currentWeight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, currentWeight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!currentWeightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CurrentWeight result = currentWeightRepository.save(currentWeight);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, currentWeight.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /current-weights/:id} : Partial updates given fields of an existing currentWeight, field will ignore if it is null
     *
     * @param id the id of the currentWeight to save.
     * @param currentWeight the currentWeight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated currentWeight,
     * or with status {@code 400 (Bad Request)} if the currentWeight is not valid,
     * or with status {@code 404 (Not Found)} if the currentWeight is not found,
     * or with status {@code 500 (Internal Server Error)} if the currentWeight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/current-weights/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CurrentWeight> partialUpdateCurrentWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CurrentWeight currentWeight
    ) throws URISyntaxException {
        log.debug("REST request to partial update CurrentWeight partially : {}, {}", id, currentWeight);
        if (currentWeight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, currentWeight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!currentWeightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CurrentWeight> result = currentWeightRepository
            .findById(currentWeight.getId())
            .map(
                existingCurrentWeight -> {
                    if (currentWeight.getWeight() != null) {
                        existingCurrentWeight.setWeight(currentWeight.getWeight());
                    }
                    if (currentWeight.getCreatedDate() != null) {
                        existingCurrentWeight.setCreatedDate(currentWeight.getCreatedDate());
                    }

                    return existingCurrentWeight;
                }
            )
            .map(currentWeightRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, currentWeight.getId().toString())
        );
    }

    /**
     * {@code GET  /current-weights} : get all the currentWeights.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of currentWeights in body.
     */
    @GetMapping("/current-weights")
    public List<CurrentWeight> getAllCurrentWeights() {
        log.debug("REST request to get all CurrentWeights");
        return currentWeightRepository.findAll();
    }

    /**
     * {@code GET  /current-weights/:id} : get the "id" currentWeight.
     *
     * @param id the id of the currentWeight to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the currentWeight, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/current-weights/{id}")
    public ResponseEntity<CurrentWeight> getCurrentWeight(@PathVariable Long id) {
        log.debug("REST request to get CurrentWeight : {}", id);
        Optional<CurrentWeight> currentWeight = currentWeightRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(currentWeight);
    }

    /**
     * {@code DELETE  /current-weights/:id} : delete the "id" currentWeight.
     *
     * @param id the id of the currentWeight to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/current-weights/{id}")
    public ResponseEntity<Void> deleteCurrentWeight(@PathVariable Long id) {
        log.debug("REST request to delete CurrentWeight : {}", id);
        currentWeightRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
