package com.ava.foodlogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FoodDay.
 */
@Entity
@Table(name = "food_day")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FoodDay implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @OneToMany(mappedBy = "foodDay")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "foodDay", "food" }, allowSetters = true)
    private Set<FoodEntry> foodEntries = new HashSet<>();

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodDay id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public FoodDay createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Set<FoodEntry> getFoodEntries() {
        return this.foodEntries;
    }

    public FoodDay foodEntries(Set<FoodEntry> foodEntries) {
        this.setFoodEntries(foodEntries);
        return this;
    }

    public FoodDay addFoodEntry(FoodEntry foodEntry) {
        this.foodEntries.add(foodEntry);
        foodEntry.setFoodDay(this);
        return this;
    }

    public FoodDay removeFoodEntry(FoodEntry foodEntry) {
        this.foodEntries.remove(foodEntry);
        foodEntry.setFoodDay(null);
        return this;
    }

    public void setFoodEntries(Set<FoodEntry> foodEntries) {
        if (this.foodEntries != null) {
            this.foodEntries.forEach(i -> i.setFoodDay(null));
        }
        if (foodEntries != null) {
            foodEntries.forEach(i -> i.setFoodDay(this));
        }
        this.foodEntries = foodEntries;
    }

    public User getUser() {
        return this.user;
    }

    public FoodDay user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FoodDay)) {
            return false;
        }
        return id != null && id.equals(((FoodDay) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FoodDay{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
