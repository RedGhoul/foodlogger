package com.ava.foodlogger.web.rest;

import com.ava.foodlogger.domain.Food;
import com.ava.foodlogger.repository.FoodRepository;
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
 * REST controller for managing {@link com.ava.foodlogger.domain.Food}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FoodResource {

    private final Logger log = LoggerFactory.getLogger(FoodResource.class);

    private static final String ENTITY_NAME = "food";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FoodRepository foodRepository;

    public FoodResource(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    /**
     * {@code POST  /foods} : Create a new food.
     *
     * @param food the food to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new food, or with status {@code 400 (Bad Request)} if the food has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/foods")
    public ResponseEntity<Food> createFood(@Valid @RequestBody Food food) throws URISyntaxException {
        log.debug("REST request to save Food : {}", food);
        if (food.getId() != null) {
            throw new BadRequestAlertException("A new food cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Food result = foodRepository.save(food);
        return ResponseEntity
            .created(new URI("/api/foods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /foods/:id} : Updates an existing food.
     *
     * @param id the id of the food to save.
     * @param food the food to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated food,
     * or with status {@code 400 (Bad Request)} if the food is not valid,
     * or with status {@code 500 (Internal Server Error)} if the food couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/foods/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Food food)
        throws URISyntaxException {
        log.debug("REST request to update Food : {}, {}", id, food);
        if (food.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, food.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Food result = foodRepository.save(food);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, food.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /foods/:id} : Partial updates given fields of an existing food, field will ignore if it is null
     *
     * @param id the id of the food to save.
     * @param food the food to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated food,
     * or with status {@code 400 (Bad Request)} if the food is not valid,
     * or with status {@code 404 (Not Found)} if the food is not found,
     * or with status {@code 500 (Internal Server Error)} if the food couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/foods/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Food> partialUpdateFood(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Food food
    ) throws URISyntaxException {
        log.debug("REST request to partial update Food partially : {}, {}", id, food);
        if (food.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, food.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Food> result = foodRepository
            .findById(food.getId())
            .map(
                existingFood -> {
                    if (food.getName() != null) {
                        existingFood.setName(food.getName());
                    }
                    if (food.getCalories() != null) {
                        existingFood.setCalories(food.getCalories());
                    }
                    if (food.getCarbohydrates() != null) {
                        existingFood.setCarbohydrates(food.getCarbohydrates());
                    }
                    if (food.getProteins() != null) {
                        existingFood.setProteins(food.getProteins());
                    }
                    if (food.getFat() != null) {
                        existingFood.setFat(food.getFat());
                    }
                    if (food.getSodium() != null) {
                        existingFood.setSodium(food.getSodium());
                    }

                    return existingFood;
                }
            )
            .map(foodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, food.getId().toString())
        );
    }

    /**
     * {@code GET  /foods} : get all the foods.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foods in body.
     */
    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getAllFoods(Pageable pageable) {
        log.debug("REST request to get a page of Foods");
        Page<Food> page = foodRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /foods/:id} : get the "id" food.
     *
     * @param id the id of the food to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the food, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/foods/{id}")
    public ResponseEntity<Food> getFood(@PathVariable Long id) {
        log.debug("REST request to get Food : {}", id);
        Optional<Food> food = foodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(food);
    }

    /**
     * {@code DELETE  /foods/:id} : delete the "id" food.
     *
     * @param id the id of the food to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        log.debug("REST request to delete Food : {}", id);
        foodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
