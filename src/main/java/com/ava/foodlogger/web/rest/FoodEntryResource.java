package com.ava.foodlogger.web.rest;

import com.ava.foodlogger.domain.FoodEntry;
import com.ava.foodlogger.repository.FoodEntryRepository;
import com.ava.foodlogger.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ava.foodlogger.domain.FoodEntry}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FoodEntryResource {

    private final Logger log = LoggerFactory.getLogger(FoodEntryResource.class);

    private static final String ENTITY_NAME = "foodEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FoodEntryRepository foodEntryRepository;

    public FoodEntryResource(FoodEntryRepository foodEntryRepository) {
        this.foodEntryRepository = foodEntryRepository;
    }

    /**
     * {@code POST  /food-entries} : Create a new foodEntry.
     *
     * @param foodEntry the foodEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new foodEntry, or with status {@code 400 (Bad Request)} if the foodEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/food-entries")
    public ResponseEntity<FoodEntry> createFoodEntry(@RequestBody FoodEntry foodEntry) throws URISyntaxException {
        log.debug("REST request to save FoodEntry : {}", foodEntry);
        if (foodEntry.getId() != null) {
            throw new BadRequestAlertException("A new foodEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FoodEntry result = foodEntryRepository.save(foodEntry);
        return ResponseEntity
            .created(new URI("/api/food-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /food-entries/:id} : Updates an existing foodEntry.
     *
     * @param id the id of the foodEntry to save.
     * @param foodEntry the foodEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodEntry,
     * or with status {@code 400 (Bad Request)} if the foodEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the foodEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/food-entries/{id}")
    public ResponseEntity<FoodEntry> updateFoodEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodEntry foodEntry
    ) throws URISyntaxException {
        log.debug("REST request to update FoodEntry : {}, {}", id, foodEntry);
        if (foodEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FoodEntry result = foodEntryRepository.save(foodEntry);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, foodEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /food-entries/:id} : Partial updates given fields of an existing foodEntry, field will ignore if it is null
     *
     * @param id the id of the foodEntry to save.
     * @param foodEntry the foodEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodEntry,
     * or with status {@code 400 (Bad Request)} if the foodEntry is not valid,
     * or with status {@code 404 (Not Found)} if the foodEntry is not found,
     * or with status {@code 500 (Internal Server Error)} if the foodEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/food-entries/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FoodEntry> partialUpdateFoodEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodEntry foodEntry
    ) throws URISyntaxException {
        log.debug("REST request to partial update FoodEntry partially : {}, {}", id, foodEntry);
        if (foodEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FoodEntry> result = foodEntryRepository
            .findById(foodEntry.getId())
            .map(
                existingFoodEntry -> {
                    if (foodEntry.getMealtype() != null) {
                        existingFoodEntry.setMealtype(foodEntry.getMealtype());
                    }
                    if (foodEntry.getCreatedDate() != null) {
                        existingFoodEntry.setCreatedDate(foodEntry.getCreatedDate());
                    }

                    return existingFoodEntry;
                }
            )
            .map(foodEntryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, foodEntry.getId().toString())
        );
    }

    /**
     * {@code GET  /food-entries} : get all the foodEntries.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foodEntries in body.
     */
    @GetMapping("/food-entries")
    public ResponseEntity<List<FoodEntry>> getAllFoodEntries(Pageable pageable) {
        log.debug("REST request to get a page of FoodEntries");
        Page<FoodEntry> page = foodEntryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /food-entries/:id} : get the "id" foodEntry.
     *
     * @param id the id of the foodEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the foodEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/food-entries/{id}")
    public ResponseEntity<FoodEntry> getFoodEntry(@PathVariable Long id) {
        log.debug("REST request to get FoodEntry : {}", id);
        Optional<FoodEntry> foodEntry = foodEntryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(foodEntry);
    }

    /**
     * {@code DELETE  /food-entries/:id} : delete the "id" foodEntry.
     *
     * @param id the id of the foodEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/food-entries/{id}")
    public ResponseEntity<Void> deleteFoodEntry(@PathVariable Long id) {
        log.debug("REST request to delete FoodEntry : {}", id);
        foodEntryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
